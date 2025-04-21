import { constants } from "http2";
import { ERROR_1002, MSG_1002 } from "../../constants/constants";
import { ApiError } from "../apiError";


export class TokenHydraServiceError extends ApiError {
    constructor(servicename: string, requestObjecT: unknown, message?: string) {
        super(constants.NGHTTP2_INTERNAL_ERROR, ERROR_1002, message || MSG_1002, servicename, requestObjecT);
    }
}
