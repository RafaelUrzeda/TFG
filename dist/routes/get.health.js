"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getHealth = (app) => {
    app.get("/health", async (req, res) => {
        const jRes = {
            status: "UP",
        };
        return res.send(jRes);
    });
};
module.exports = getHealth;
