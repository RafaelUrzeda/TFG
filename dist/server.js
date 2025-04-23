"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dd_trace_1 = require("dd-trace");
const apm = require("elastic-apm-node");
const process = require("node:process");
const config_1 = require("./config/config");
if (process.env["DD_SERVICE"]) {
    dd_trace_1.default.init();
}
else if (process.env["APM_SERVICENAME"]) {
    apm.start({
        serviceName: process.env.APM_SERVICENAME,
        serverUrl: process.env.APM_SERVERURL,
        environment: process.env.ENV,
        ignoreUrls: [""],
    });
}
const aea_logger_1 = require("aea-logger");
const figlet = require("figlet");
const fs_1 = require("fs");
const app_1 = require("./app");
const now = Date.now();
const pkj = JSON.parse((0, fs_1.readFileSync)("package.json", { encoding: "utf-8" }));
console.log(figlet.textSync("  " + pkj.name));
aea_logger_1.logger.info("*".repeat(80));
aea_logger_1.logger.info("Init App Version " + pkj.version);
const start = async () => {
    try {
        await (0, app_1.init)();
        const server = (0, app_1.build)();
        const fastifyListenOptions = {
            port: config_1.default.server.port,
            host: config_1.default.server.ipv6 ? "::" : "0.0.0.0",
        };
        server.listen(fastifyListenOptions, (e) => {
            if (!e) {
                aea_logger_1.logger.info("App started on port: " + config_1.default.server.port);
                aea_logger_1.logger.info("Started App in " + (Date.now() - now) + " milliseconds");
                aea_logger_1.logger.info("*".repeat(80));
            }
            else {
                aea_logger_1.logger.error(e);
                process.exit(1);
            }
        });
    }
    catch (e) {
        aea_logger_1.logger.error(e);
        process.exit(1);
    }
};
start();
