"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itlBookingController = void 0;
const aea_logger_1 = require("aea-logger");
const http2_1 = require("http2");
const itlBooking_service_1 = require("../service/itlBooking.service");
const itlBookingController = async (req, res) => {
    const { idReserva: idBooking } = req.body;
    const response = await (0, itlBooking_service_1.fullItlBookingService)(idBooking);
    aea_logger_1.operationalTracer.info("booking", {
        request: { booking: { idReserva: idBooking } },
        response: { description: response },
        statusCode: http2_1.constants.HTTP_STATUS_OK,
    });
    return res.header("Content-Type", "application/json").send(response);
};
exports.itlBookingController = itlBookingController;
