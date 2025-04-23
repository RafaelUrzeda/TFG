"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    status;
    errorCode;
    errorDescription;
    constructor(status, code, message) {
        super(message);
        this.name = new.target.name;
        this.status = status;
        this.errorCode = code;
        this.errorDescription = message;
    }
}
exports.CustomError = CustomError;
