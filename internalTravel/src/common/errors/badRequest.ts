import { constants } from "http2";
import { ERROR_0009, MSG_0009 } from "../../constants/constants";
import { ApiError } from "../apiError";

export class badRequest extends ApiError {
    constructor(serviceName: string, requestObject: unknown, message?: string) {
        super(constants.HTTP_STATUS_BAD_REQUEST, ERROR_0009, message || MSG_0009, serviceName, requestObject);
    }
}