"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    status;
    errorCode;
    errorDescription;
    serviceName;
    request;
    constructor(status, code, message, serviceName, request) {
        super(message);
        this.name = new.target.name;
        this.status = status;
        this.errorCode = code;
        this.errorDescription = message;
        this.serviceName = serviceName;
        this.request = request;
    }
}
exports.ApiError = ApiError;
