import { constants } from "http2";
import { ERROR_1001, MSG_1001 } from "../../constants/constants";
import { ApiError } from "../apiError";

export class STSServiceError extends ApiError {
    constructor(servicename: string, requestObjecT: unknown, message?: string, code?: number) {
        super(code || constants.NGHTTP2_INTERNAL_ERROR, ERROR_1001, message || MSG_1001, servicename, requestObjecT);
    }
}
