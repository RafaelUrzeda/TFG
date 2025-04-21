"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stsServiceException = void 0;
const stsServiceError_1 = require("../common/errors/stsServiceError");
const stsServiceException = (servicename, requestObject, error) => {
    throw new stsServiceError_1.STSServiceError(servicename, requestObject, error.message, error.status);
};
exports.stsServiceException = stsServiceException;
