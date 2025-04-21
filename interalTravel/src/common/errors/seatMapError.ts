import { constants } from "http2";
import { ERROR_1003, MSG_1003 } from "../../constants/constants";
import { ApiError } from "../apiError";

export class seatMapError extends ApiError {
    constructor(serviceName: string, requestObject: unknown, message?: string) {
      super(constants.HTTP_STATUS_NOT_FOUND, ERROR_1003, message || MSG_1003, serviceName, requestObject);
    }
  }