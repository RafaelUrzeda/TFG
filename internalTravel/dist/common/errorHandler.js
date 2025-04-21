"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customErrorHandler = exports.ERROR_HANDLERS = void 0;
const aea_logger_1 = require("aea-logger");
const apiError_1 = require("./apiError");
const errorResponse_1 = require("./errorResponse");
const unexpectedError_1 = require("./errors/unexpectedError");
const customError_1 = require("./customError");
exports.ERROR_HANDLERS = {
    DefaultError: (res, error) => {
        if (error instanceof customError_1.CustomError) {
            const customError = error;
            res
                .code(customError.status)
                .send(new errorResponse_1.ErrorResponse(customError.errorCode, customError.message));
        }
        if (error instanceof apiError_1.ApiError) {
            const apiError = error;
            aea_logger_1.operationalTracer.error(apiError.serviceName, {
                request: apiError.request,
                error: {
                    name: apiError.errorCode,
                    description: apiError.errorDescription,
                },
                statusCode: apiError.status,
            });
            res
                .code(apiError.status)
                .send(new errorResponse_1.ErrorResponse(apiError.errorCode, apiError.message));
        }
        else {
            const anyError = new unexpectedError_1.UnexpectedError();
            aea_logger_1.operationalTracer.error(anyError.serviceName, {
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
    FST_ERR_VALIDATION: (res, error) => {
        return res.status(400).send({
            errorCode: 400,
            errorDescription: error.message,
            allowedValues: error.validation.length
                ? error.validation[0].params.allowedValues
                : undefined,
        });
    },
};
const customErrorHandler = (error, _, res) => {
    const handler = exports.ERROR_HANDLERS[error.name || error.constructor.name || error.code] ||
        exports.ERROR_HANDLERS.DefaultError;
    aea_logger_1.logger.error(error);
    return handler(res, error);
};
exports.customErrorHandler = customErrorHandler;
