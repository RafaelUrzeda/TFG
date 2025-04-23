"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = void 0;
class ErrorResponse {
    errorCode;
    errorDescription;
    constructor(errorCode, errorDescription) {
        this.errorCode = errorCode;
        this.errorDescription = errorDescription;
    }
}
exports.ErrorResponse = ErrorResponse;
