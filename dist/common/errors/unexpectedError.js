"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmadeusError = exports.UnexpectedError = void 0;
const http2_1 = require("http2");
const constants_1 = require("../../constants/constants");
const apiError_1 = require("../apiError");
const customError_1 = require("../customError");
class UnexpectedError extends apiError_1.ApiError {
    constructor(message) {
        super(http2_1.constants.NGHTTP2_INTERNAL_ERROR, constants_1.ERROR_0008, message || constants_1.MSG_ISE, "UnexpectedError", {
            unexpectedError: {},
        });
    }
}
exports.UnexpectedError = UnexpectedError;
class AmadeusError extends customError_1.CustomError {
    constructor(messages) {
        const defaultMessage = "UnexpectedError";
        const errorMessage = `Amadeus reporta el siguiente error: ${messages ? messages.join(", ") : defaultMessage}`;
        super(http2_1.constants.HTTP_STATUS_BAD_REQUEST, "AMA-0001", errorMessage);
    }
}
exports.AmadeusError = AmadeusError;
