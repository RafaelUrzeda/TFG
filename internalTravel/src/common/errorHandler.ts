import { logger, operationalTracer } from "aea-logger";
import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "./apiError";
import { ErrorResponse } from "./errorResponse";
import { UnexpectedError } from "./errors/unexpectedError";
import { IFastifyError } from "./fastifyError";
import { CustomError } from "./customError";

export const ERROR_HANDLERS: {
  [error: string]: (res: FastifyReply, error: IFastifyError) => void;
} = {
  DefaultError: (res: FastifyReply, error: Error) => {

    if (error instanceof CustomError) {
      const customError = <CustomError>error;
      res
        .code(customError.status)
        .send(new ErrorResponse(customError.errorCode, customError.message));
    }
    if (error instanceof ApiError) {
      const apiError = <ApiError>error;

      operationalTracer.error(apiError.serviceName, {
        request: apiError.request,
        error: {
          name: apiError.errorCode,
          description: apiError.errorDescription,
        },
        statusCode: apiError.status,
      });

      res
        .code(apiError.status)
        .send(new ErrorResponse(apiError.errorCode, apiError.message));
    } else {
      const anyError = new UnexpectedError();

      operationalTracer.error(anyError.serviceName, {
        request: anyError.request,
        error: {
          name: anyError.errorCode,
          description: anyError.errorDescription,
        },
        statusCode: anyError.status,
      });

      res.code(500).send(anyError);
    }
  },
  // Fastify error sample, remove if no need
  FST_ERR_VALIDATION: (res: FastifyReply, error: IFastifyError) => {
    return res.status(400).send({
      errorCode: 400,
      errorDescription: error.message,
      allowedValues: error.validation.length
        ? error.validation[0].params.allowedValues
        : undefined,
    });
  },
};

export const customErrorHandler = (
  error: IFastifyError,
  _: FastifyRequest,
  res: FastifyReply,
) => {
  const handler =
    ERROR_HANDLERS[error.name || error.constructor.name || error.code] ||
    ERROR_HANDLERS.DefaultError;
  logger.error(error);
  return handler(res, error);
};
