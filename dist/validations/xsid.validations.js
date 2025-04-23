"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateXsid = void 0;
const http2_1 = require("http2");
const authorization_1 = require("../common/errors/authorization");
const sts_external_1 = require("../externals/sts.external");
const validateXsid = async (xsid) => {
    const sts = await (0, sts_external_1.postSTSCheck)(xsid);
    if (sts.success === true) {
        return true;
    }
    throw new authorization_1.authorization('Authorization Error', http2_1.constants.HTTP_STATUS_UNAUTHORIZED, 'Invalid XSID');
};
exports.validateXsid = validateXsid;
