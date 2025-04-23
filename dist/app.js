"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.build = void 0;
const aea_logger_1 = require("aea-logger");
const fastify_1 = require("fastify");
const process = require("node:process");
const config_1 = require("./config/config");
const db = require("./database/interline.oracle.datasource");
const routes_1 = require("./routes");
const init = async () => {
    try {
        await db.init({
            user: config_1.default.datasource.user,
            connectionString: config_1.default.datasource.connectionString,
            password: process.env.comser_db_password || '',
            poolMax: config_1.default.datasource.poolMax
        });
    }
    catch (e) {
        aea_logger_1.logger.error("app init - " + e);
        process.exit(1);
    }
};
exports.init = init;
const build = () => {
    const app = (0, fastify_1.default)();
    // Routes
    (0, routes_1.default)(app).catch((e) => {
        aea_logger_1.logger.error(e);
    });
    return app;
};
exports.build = build;
