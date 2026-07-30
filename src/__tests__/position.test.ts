import {
  boardFromPositionId,
  calculatePipCount,
  decodePositionId,
} from '../position'
import { POSITION_ID_FIXTURES } from './fixtures/positionIds'

/**
 * The public client renders boards through `boardFromPositionId` and
 * `calculatePipCount` (ReviewBoard, PracticeBoard), so a silent error in this
 * file's 496 lines of bit manipulation shows up as a wrong board rather than as
 * a crash. Until these tests existed, nothing checked any of it.
 */

const WHITE_ON_ROLL = { color: 'white', direction: 'clockwise' } as const
const BLACK_ON_ROLL = { color: 'black', direction: 'counterclockwise' } as const

/** Standard opening, both sides. Symmetric, so it cannot detect a side swap. */
const OPENING_ID = '4HPwATDgc/ABMA'

/** first side: bar 2, 5 on 6, 3 on 8, 5 on 13. second: bar 1, 4 on 6, 3 on 8, 5 on 13, 2 on 24. */
const BOTH_BARS_ID = '4HPwAWDgOfgAWA'

describe('decodePositionId', () => {
  it.each(POSITION_ID_FIXTURES)(
    'decodes $name to the sides core encoded',
    ({ positionId, firstSide, secondSide }) => {
      const decoded = decodePositionId(positionId)
      expect(decoded.opponent).toEqual(firstSide)
      expect(decoded.onRoll).toEqual(secondSide)
    }
  )

  it('gives each side 25 entries', () => {
    for (const { positionId } of POSITION_ID_FIXTURES) {
      const decoded = decodePositionId(positionId)
      expect(decoded.opponent).toHaveLength(25)
      expect(decoded.onRoll).toHaveLength(25)
    }
  })

  it('rejects a position id that is not 14 characters', () => {
    expect(() => decodePositionId('4HPwATDgc/ABM')).toThrow(/14 characters/)
    expect(() => decodePositionId('4HPwATDgc/ABMAA')).toThrow(/14 characters/)
    expect(() => decodePositionId('')).toThrow(/14 characters/)
  })
})

describe('the side ordering convention', () => {
  /**
   * This is the assertion that matters most in this file, and it is the one a
   * refactor is most likely to break silently.
   *
   * A GNU position id carries no turn marker. It has two sides and the reader
   * must decide which is which. This package decodes the side encoded FIRST as
   * the OPPONENT — matching core's `Board/gnuPositionId.ts` encoder and the
   * engine protocol's default `positionIdConvention`.
   *
   * `@nodots/backgammon-core`'s XGID module decodes the same first side as the
   * player ON ROLL, which is the ordering GNU Backgammon itself produces. Both
   * are internally consistent. Neither is wrong. They are mirror images, so an
   * id crossing from one convention to the other renders with both players'
   * checkers on the wrong sides — a display bug, not a decode error, which is
   * how it survives review.
   *
   * If this test fails, do not "fix" it by flipping the expectation. Find out
   * which convention the ids reaching this decoder are written in.
   */
  it('treats the FIRST encoded side as the opponent, not the player on roll', () => {
    const asymmetric = POSITION_ID_FIXTURES.find(
      (f) => f.name === 'asymmetric midgame'
    )
    if (!asymmetric) throw new Error('the asymmetric fixture is required here')

    const decoded = decodePositionId(asymmetric.positionId)

    expect(decoded.opponent).toEqual(asymmetric.firstSide)
    expect(decoded.onRoll).toEqual(asymmetric.secondSide)
    // And the two are genuinely distinguishable, so this proves an ordering
    // rather than passing vacuously on a symmetric board.
    expect(asymmetric.firstSide).not.toEqual(asymmetric.secondSide)
  })
})

describe('boardFromPositionId', () => {
  it('materializes the standard opening', () => {
    const board = boardFromPositionId(OPENING_ID, WHITE_ON_ROLL)

    expect(board.points).toHaveLength(24)

    const occupied = board.points
      .filter((p) => p.checkers.length > 0)
      .map((p) => ({
        clockwise: p.position.clockwise,
        count: p.checkers.length,
        color: p.checkers[0].color,
      }))
      .sort((a, b) => a.clockwise - b.clockwise)

    expect(occupied).toEqual([
      { clockwise: 1, count: 2, color: 'black' },
      { clockwise: 6, count: 5, color: 'white' },
      { clockwise: 8, count: 3, color: 'white' },
      { clockwise: 12, count: 5, color: 'black' },
      { clockwise: 13, count: 5, color: 'white' },
      { clockwise: 17, count: 3, color: 'black' },
      { clockwise: 19, count: 5, color: 'black' },
      { clockwise: 24, count: 2, color: 'white' },
    ])
  })

  it('puts 15 checkers of each colour on the board for a no-checkers-off id', () => {
    const board = boardFromPositionId(OPENING_ID, WHITE_ON_ROLL)
    const count = (color: 'black' | 'white') =>
      board.points.reduce(
        (n, p) => n + p.checkers.filter((c) => c.color === color).length,
        0
      )

    expect(count('white')).toBe(15)
    expect(count('black')).toBe(15)
  })

  it('assigns the on-roll side to whichever colour the context names', () => {
    const whiteOnRoll = boardFromPositionId(BOTH_BARS_ID, WHITE_ON_ROLL)
    const blackOnRoll = boardFromPositionId(BOTH_BARS_ID, BLACK_ON_ROLL)

    // The on-roll side of this fixture holds one bar checker, the opponent two.
    expect(whiteOnRoll.bar.clockwise.checkers).toHaveLength(1)
    expect(whiteOnRoll.bar.counterclockwise.checkers).toHaveLength(2)

    expect(blackOnRoll.bar.counterclockwise.checkers).toHaveLength(1)
    expect(blackOnRoll.bar.clockwise.checkers).toHaveLength(2)
  })

  it('routes checkers to the bar rather than dropping them', () => {
    const board = boardFromPositionId(BOTH_BARS_ID, WHITE_ON_ROLL)
    const onBar =
      board.bar.clockwise.checkers.length +
      board.bar.counterclockwise.checkers.length

    expect(onBar).toBe(3)
  })
})

describe('calculatePipCount', () => {
  it('counts the opening at 167 for both players', () => {
    const board = boardFromPositionId(OPENING_ID, WHITE_ON_ROLL)

    expect(calculatePipCount(board, 'white', 'clockwise')).toBe(167)
    expect(calculatePipCount(board, 'black', 'counterclockwise')).toBe(167)
  })

  it('charges 25 pips for each checker on the bar', () => {
    // Hand-computed from the fixture, in each side's own direction:
    //   on-roll  = 25(bar) + 4x6 + 3x8 + 5x13 + 2x24 = 186
    //   opponent = 50(bar) + 5x6 + 3x8 + 5x13        = 169
    const board = boardFromPositionId(BOTH_BARS_ID, WHITE_ON_ROLL)

    expect(calculatePipCount(board, 'white', 'clockwise')).toBe(186)
    expect(calculatePipCount(board, 'black', 'counterclockwise')).toBe(169)
  })

  it('is direction-relative, so reading a player in the wrong frame differs', () => {
    const board = boardFromPositionId(OPENING_ID, WHITE_ON_ROLL)

    // Same colour, opposite frame: 167 is only correct in the player's own
    // direction of travel. This pins that the argument is load-bearing.
    expect(calculatePipCount(board, 'white', 'counterclockwise')).not.toBe(167)
  })
})
