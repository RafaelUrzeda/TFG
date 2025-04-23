import { constants } from "http2";
import { ERROR_0005, MSG_0005 } from "../../constants/constants";
import { ApiError } from "../apiError";

export class paxNotFound extends ApiError {
  constructor(serviceName: string, requestObject: unknown, message?: string) {
    super(constants.HTTP_STATUS_NOT_FOUND, MSG_0005, message || ERROR_0005, serviceName, requestObject);
  }
}
