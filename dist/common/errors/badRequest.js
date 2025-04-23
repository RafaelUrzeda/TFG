"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badRequest = void 0;
const http2_1 = require("http2");
const constants_1 = require("../../constants/constants");
const apiError_1 = require("../apiError");
class badRequest extends apiError_1.ApiError {
    constructor(serviceName, requestObject, message) {
        super(http2_1.constants.HTTP_STATUS_BAD_REQUEST, constants_1.ERROR_0009, message || constants_1.MSG_0009, serviceName, requestObject);
    }
}
exports.badRequest = badRequest;
