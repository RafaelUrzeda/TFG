import { constants as httpcodes } from "http2";
import { authorization } from "../common/errors/authorization";

export const authorizationValidate = (
    token?: string,
    xsid?: unknown,
) => {
    if((!token || "") && !xsid) {
        throw new authorization(
            'Authorization Error',
            httpcodes.HTTP_STATUS_UNAUTHORIZED,
            'Falta autorización'
        );
    }
};
