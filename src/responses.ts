/**
 * API Response Types
 * 
 * These types represent the serialized format of data sent from the API to clients.
 * The main difference from CORE types is that Set<T> becomes Array<T> for JSON compatibility.
 * 
 * IMPORTANT: The serialization functions in API's utils/serialization.ts return `any` type
 * to avoid complex TypeScript issues with the deeply nested game state.
 * However, the actual runtime behavior is:
 * 
 * 1. CORE stores activePlay.moves as Set<BackgammonMove>
 * 2. API serialization converts Set → Array before sending responses
 * 3. CLIENT receives activePlay.moves as BackgammonMove[]
 * 
 * These types document the expected shape of API responses,
 * even though they're not enforced at compile time due to complexity.
 */

import type {
  BackgammonGame,
  BackgammonPlay,
  BackgammonMove,
  BackgammonPlayer,
  BackgammonBoard,
  BackgammonCube,
  BackgammonOffer,
  BackgammonDice
} from '@nodots/backgammon-types'

/**
 * Serialized version of BackgammonPlay where moves is an Array instead of Set
 */
export interface SerializedBackgammonPlay extends Omit<BackgammonPlay, 'moves'> {
  moves: BackgammonMove[] // Array instead of Set<BackgammonMove>
}

/**
 * Serialized version of BackgammonGame for API responses
 * Main changes:
 * - activePlay.moves is Array instead of Set
 * - Players include current pip counts
 * - gnuPositionId is included as a property
 * - activePlay can be null (when in rolling state) or undefined
 */
export interface SerializedBackgammonGame extends Omit<BackgammonGame, 'activePlay' | 'players' | 'activePlayer' | 'inactivePlayer' | 'gnuPositionId'> {
  activePlay?: SerializedBackgammonPlay | null  // Can be null when in rolling state
  players: Array<BackgammonPlayer & { pipCount: number }>
  activePlayer?: (BackgammonPlayer & { pipCount: number }) | null
  inactivePlayer?: (BackgammonPlayer & { pipCount: number }) | null
  gnuPositionId?: string
}

/**
 * Game-specific API responses
 */
export interface GameResponse extends ApiResponse<SerializedBackgammonGame> {
  data: SerializedBackgammonGame
}

export interface GamesListResponse extends ApiResponse<SerializedBackgammonGame[]> {
  data: SerializedBackgammonGame[]
}

/**
 * Machine-readable failure reasons.
 *
 * `error` carries a human-readable sentence, which is fine to show and wrong to
 * branch on — rewording it would silently change behaviour in every consumer
 * that matched the string. `code` is the stable half of the contract.
 *
 * Add members as distinct failures appear; do not repurpose an existing one.
 */
export const API_ERROR_CODES = {
  /**
   * The resource changed between being read and being written, so the write was
   * refused rather than applied on top of a stale snapshot.
   *
   * Accompanies HTTP 409. Recovery is to re-read the resource and decide again
   * — the original request cannot simply be replayed, because the action it
   * described may no longer be legal against the current state.
   */
  VERSION_CONFLICT: 'version_conflict',
} as const

export type ApiErrorCode =
  (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES]

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  /**
   * Set when a failure has a defined reason a caller can act on. Optional:
   * responses predating a given code, and failures with no specific handling,
   * carry only `error`.
   */
  code?: ApiErrorCode
  message?: string
}