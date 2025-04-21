"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STSServiceError = void 0;
const http2_1 = require("http2");
const constants_1 = require("../../constants/constants");
const apiError_1 = require("../apiError");
class STSServiceError extends apiError_1.ApiError {
    constructor(servicename, requestObjecT, message, code) {
        super(code || http2_1.constants.NGHTTP2_INTERNAL_ERROR, constants_1.ERROR_1001, message || constants_1.MSG_1001, servicename, requestObjecT);
    }
}
exports.STSServiceError = STSServiceError;
