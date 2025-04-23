"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itlUpdateBookingController = void 0;
const aea_logger_1 = require("aea-logger");
const http2_1 = require("http2");
const itlUpdateBooking_service_1 = require("../service/itlUpdateBooking.service");
const itlUpdateBookingController = async (req, res) => {
    const { idReserva, localizador, xsid } = req.body;
    const token = req.headers.authorization || "";
    const response = await (0, itlUpdateBooking_service_1.fullItlUpdateBookingService)(idReserva, token, localizador);
    aea_logger_1.operationalTracer.info("booking", {
        request: { booking: { idReserva } },
        response: { description: response },
        statusCode: http2_1.constants.HTTP_STATUS_OK,
    });
    return res.header("Content-Type", "application/json").send(response);
};
exports.itlUpdateBookingController = itlUpdateBookingController;
