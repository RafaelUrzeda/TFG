"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getConf_1 = require("../service/getConf");
const getConf = (app) => {
    app.get("/conf", async (req, res) => {
        return res.send(await (0, getConf_1.default)());
    });
};
module.exports = getConf;
