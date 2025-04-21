"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itlGetPnrService = void 0;
const pnrAmadeus_external_1 = require("../externals/pnrAmadeus.external");
const itlGetPnrService = async (locata, token) => {
    const response = await (0, pnrAmadeus_external_1.getAmadeusPNR)(locata, token);
    return response.data;
};
exports.itlGetPnrService = itlGetPnrService;
