import { constants } from "http2";
import { ERROR_0008, MSG_ISE } from "../../constants/constants";
import { ApiError } from "../apiError";
import { CustomError } from "../customError";


export class UnexpectedError extends ApiError {
  constructor(message?: string) {
    super(constants.NGHTTP2_INTERNAL_ERROR, ERROR_0008, message || MSG_ISE, "UnexpectedError", {
      unexpectedError: {},
    });
  }
}

export class AmadeusError extends CustomError {
  constructor(messages?: string[]) {
    const defaultMessage = "UnexpectedError";
    const errorMessage = `Amadeus reporta el siguiente error: ${messages ? messages.join(", ") : defaultMessage}`;
    super(
      constants.HTTP_STATUS_BAD_REQUEST, 
      "AMA-0001",                       
      errorMessage
    );
  }
}


