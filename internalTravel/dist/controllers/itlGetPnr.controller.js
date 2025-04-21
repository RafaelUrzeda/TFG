"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itlGetPnr = void 0;
const aea_logger_1 = require("aea-logger");
const http2_1 = require("http2");
const itlGetPnr_service_1 = require("../service/itlGetPnr.service");
const itlGetPnr = async (req, res) => {
    const { locata, xsid } = req.body;
    const token = req.headers.authorization || "";
    const response = await (0, itlGetPnr_service_1.itlGetPnrService)(locata, token);
    aea_logger_1.operationalTracer.info("booking", {
        request: { booking: { locata } },
        response: { description: response },
        statusCode: http2_1.constants.HTTP_STATUS_OK,
    });
    return res.header("Content-Type", "application/json").send(response);
};
exports.itlGetPnr = itlGetPnr;
