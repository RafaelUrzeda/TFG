"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itlDeleteBooking = void 0;
const aea_logger_1 = require("aea-logger");
const http2_1 = require("http2");
const itlDeleteBooking_service_1 = require("../service/itlDeleteBooking.service");
const authorization_validations_1 = require("../validations/authorization.validations");
const itlDeleteBooking = async (req, res) => {
    const { locata, xsid } = req.body;
    const token = req.headers.authorization || "";
    (0, authorization_validations_1.authorizationValidate)(token, xsid);
    const response = await (0, itlDeleteBooking_service_1.itlDeleteBookingService)(locata, token);
    aea_logger_1.operationalTracer.info("booking", {
        request: { booking: { locata } },
        response: { description: response },
        statusCode: http2_1.constants.HTTP_STATUS_OK,
    });
    return res.header("Content-Type", "application/json").send(response);
};
exports.itlDeleteBooking = itlDeleteBooking;
