"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = void 0;
const http2_1 = require("http2");
const constants_1 = require("../../constants/constants");
const apiError_1 = require("../apiError");
class authorization extends apiError_1.ApiError {
    constructor(serviceName, requestObject, message) {
        super(http2_1.constants.HTTP_STATUS_NOT_FOUND, constants_1.ERROR_1005, message || constants_1.MSG_1005, serviceName, requestObject);
    }
}
exports.authorization = authorization;
