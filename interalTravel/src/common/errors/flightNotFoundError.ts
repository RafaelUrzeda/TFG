import { constants } from "http2";
import { ERROR_0001, MSG_0001 } from "../../constants/constants";
import { ApiError } from "../apiError";

export class flightNotFoundError extends ApiError {
    constructor(serviceName: string, requestObject: unknown, message?: string) {
        super(constants.HTTP_STATUS_NOT_FOUND, ERROR_0001, message || MSG_0001, serviceName, requestObject);
    }
}
