"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSuccessResponse = createSuccessResponse;
exports.createErrorResponse = createErrorResponse;
exports.isApiError = isApiError;
exports.isApiSuccess = isApiSuccess;
// Re-export request types
__exportStar(require("./requests"), exports);
// Re-export response types
__exportStar(require("./responses"), exports);
// Re-export WebSocket event types
__exportStar(require("./websocket"), exports);
// Re-export user and auth types
__exportStar(require("./users"), exports);
// Helper functions
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