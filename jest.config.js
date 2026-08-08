/**
 * ts-jest was already a devDependency here, but there was no jest config of any
 * kind, so `npm test` ran jest with its defaults: babel-jest, which cannot parse
 * TypeScript. Any test written in this package would have failed to compile.
 * That is the likely reason it has none.
 *
 * `testMatch` is deliberately narrower than jest's default. The default treats
 * every file under a `__tests__` directory as a suite, which would make
 * `__tests__/fixtures/positionIds.ts` fail as a suite containing no tests.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
}
