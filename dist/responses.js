"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=responses.js.map