import { constants } from "http2";
import { ERROR_1004, MSG_1004 } from "../../constants/constants";
import { ApiError } from "../apiError";

export class elementsNotFoundError extends ApiError {
    constructor(serviceName: string, requestObject: unknown, message?: string) {
        super(constants.HTTP_STATUS_NOT_FOUND, MSG_1004, message || ERROR_1004, serviceName, requestObject);
    }
}
