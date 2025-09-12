export * from './requests';
export * from './responses';
export * from './websocket';
export * from './users';
export type { BackgammonGamePreferences, GamePreferences } from './users';
import { ApiResponse } from './responses';
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