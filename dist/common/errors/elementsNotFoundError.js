"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.elementsNotFoundError = void 0;
const http2_1 = require("http2");
const constants_1 = require("../../constants/constants");
const apiError_1 = require("../apiError");
class elementsNotFoundError extends apiError_1.ApiError {
    constructor(serviceName, requestObject, message) {
        super(http2_1.constants.HTTP_STATUS_NOT_FOUND, constants_1.MSG_1004, message || constants_1.ERROR_1004, serviceName, requestObject);
    }
}
exports.elementsNotFoundError = elementsNotFoundError;
