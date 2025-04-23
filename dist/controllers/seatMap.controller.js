"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seatMapController = void 0;
const aea_logger_1 = require("aea-logger");
const http2_1 = require("http2");
const seatMap_service_1 = require("../service/seatMap.service");
const seatMapController = async (req, res) => {
    const object = req.body;
    const token = req.headers.authorization || "";
    const response = await (0, seatMap_service_1.getSeatMapService)(object, token);
    aea_logger_1.operationalTracer.info("postMultiavailability", {
        request: { postSeatMapRequest: object },
        response: { postSeatMapRequest: response },
        statusCode: http2_1.constants.HTTP_STATUS_OK,
    });
    return res.header("Content-Type", "application/json").send(response);
};
exports.seatMapController = seatMapController;
