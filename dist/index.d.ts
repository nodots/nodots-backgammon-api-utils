export type { UserPreferences, UserState, UserType, User, ExternalUser, AuthenticatedRequest, Preference, BackgammonGamePreferences, GamePreferences } from './users';
export type { CreateGameRequest, CreateUserRequest, UpdateUserRequest } from './requests';
export type { ApiResponse, SerializedBackgammonPlay, SerializedBackgammonGame, GameResponse, GamesListResponse, WebSocketEvent, GameStateUpdateEvent, GameUpdatedEvent, MoveMadeEvent, GameCompletedEvent } from './responses';
import type { ApiResponse } from './responses';
export interface ApiErrorResponse {
    success: false;
    error: string;
    message?: string;
}
export interface ApiSuccessResponse<T = any> {
    success: true;
    data: T;
}
export declare function createSuccessResponse<T>(data: T): ApiSuccessResponse<T>;
export declare function createErrorResponse(error: string, message?: string): ApiErrorResponse;
export declare function isApiError(response: ApiResponse): response is ApiErrorResponse;
export declare function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T>;
//# sourceMappingURL=index.d.ts.map