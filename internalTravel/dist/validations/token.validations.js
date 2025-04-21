"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenHydraServiceException = void 0;
const tokenHydraServiceError_1 = require("../common/errors/tokenHydraServiceError");
const tokenHydraServiceException = (servicename, requestObject) => {
    throw new tokenHydraServiceError_1.TokenHydraServiceError(servicename, requestObject);
};
exports.tokenHydraServiceException = tokenHydraServiceException;
