"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aea_logger_1 = require("aea-logger");
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const routes = async (app) => {
    aea_logger_1.logger.info("Routes");
    const files = fs.readdirSync(__dirname).filter((file) => {
        return file.indexOf(".") !== 0 && file !== basename;
    });
    try {
        for (const file of files) {
            const directoryMainRouteFile = `./${file}`;
            const routeModule = await Promise.resolve(`${directoryMainRouteFile}`).then(s => require(s));
            routeModule(app);
            aea_logger_1.logger.info("    |--> [Load] " + file);
        }
    }
    catch (error) {
        aea_logger_1.logger.error("Error loading routes: " + error);
        process.exit(1);
    }
};
exports.default = routes;
