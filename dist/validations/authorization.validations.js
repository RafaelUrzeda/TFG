"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationValidate = void 0;
const http2_1 = require("http2");
const authorization_1 = require("../common/errors/authorization");
const authorizationValidate = (token, xsid) => {
    if ((!token || "") && !xsid) {
        throw new authorization_1.authorization('Authorization Error', http2_1.constants.HTTP_STATUS_UNAUTHORIZED, 'Falta autorización');
    }
};
exports.authorizationValidate = authorizationValidate;
