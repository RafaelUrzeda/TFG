import { constants } from "http2";
import { ERROR_1005, MSG_1005 } from "../../constants/constants";
import { ApiError } from "../apiError";

export class authorization extends ApiError {
    constructor(serviceName: string, requestObject: unknown, message?: string) {
        super(constants.HTTP_STATUS_NOT_FOUND, ERROR_1005, message || MSG_1005, serviceName, requestObject);
    }
}