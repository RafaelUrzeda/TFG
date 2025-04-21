import { constants } from "http2";
import { ERROR_1006, MSG_1006 } from "../../constants/constants";
import { ApiError } from "../apiError";


export class unvailable extends ApiError {
    constructor(serviceName: string, requestObject: unknown, message?: string) {
        super(constants.HTTP_STATUS_SERVICE_UNAVAILABLE, ERROR_1006, message || MSG_1006, serviceName, requestObject);
    }
}