"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postFinishSessionAma = void 0;
const axios_1 = require("axios");
const http2_1 = require("http2");
const serviceUnvailable_1 = require("../common/errors/serviceUnvailable");
const postFinishSessionAma = async (amadeusSession) => {
    const url = ``;
    const headers = {
        'Content-Type': 'application/json',
        'AmadeusSession': amadeusSession,
    };
    const body = {};
    try {
        const response = await axios_1.default.post(url, body, { headers });
        return response.data;
    }
    catch (error) {
        throw new serviceUnvailable_1.unvailable(`Service is unvailable`, http2_1.constants.HTTP_STATUS_SERVICE_UNAVAILABLE, `Servicio no responde`);
    }
};
exports.postFinishSessionAma = postFinishSessionAma;
