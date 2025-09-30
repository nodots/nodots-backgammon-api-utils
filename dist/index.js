"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSuccessResponse = createSuccessResponse;
exports.createErrorResponse = createErrorResponse;
exports.isApiError = isApiError;
exports.isApiSuccess = isApiSuccess;
function createSuccessResponse(data) {
    return {
        success: true,
        data
    };
}
function createErrorResponse(error, message) {
    return {
        success: false,
        error,
        message
    };
}
function isApiError(response) {
    return !response.success;
}
function isApiSuccess(response) {
    return response.success;
}
//# sourceMappingURL=index.js.map