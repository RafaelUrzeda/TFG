"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenHydraServiceError = void 0;
const http2_1 = require("http2");
const constants_1 = require("../../constants/constants");
const apiError_1 = require("../apiError");
class TokenHydraServiceError extends apiError_1.ApiError {
    constructor(servicename, requestObjecT, message) {
        super(http2_1.constants.NGHTTP2_INTERNAL_ERROR, constants_1.ERROR_1002, message || constants_1.MSG_1002, servicename, requestObjecT);
    }
}
exports.TokenHydraServiceError = TokenHydraServiceError;
