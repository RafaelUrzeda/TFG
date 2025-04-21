"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unvailable = void 0;
const http2_1 = require("http2");
const constants_1 = require("../../constants/constants");
const apiError_1 = require("../apiError");
class unvailable extends apiError_1.ApiError {
    constructor(serviceName, requestObject, message) {
        super(http2_1.constants.HTTP_STATUS_SERVICE_UNAVAILABLE, constants_1.ERROR_1006, message || constants_1.MSG_1006, serviceName, requestObject);
    }
}
exports.unvailable = unvailable;
