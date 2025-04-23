"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config/config");
const aea_logger_1 = require("aea-logger");
const getConf = async () => {
    aea_logger_1.operationalTracer.info("getConf", { conf: config_1.default });
    return config_1.default;
};
exports.default = getConf;
