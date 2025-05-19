import tracer from "dd-trace";
import * as apm from "elastic-apm-node";
import * as process from "node:process";
import conf from "./config/config";

if (process.env["DD_SERVICE"]) {
  tracer.init();
} else if (process.env["APM_SERVICENAME"]) {
  apm.start({
    serviceName: process.env.APM_SERVICENAME,
    serverUrl: process.env.APM_SERVERURL,
    environment: process.env.ENV,
    ignoreUrls: [""],
  });
}

import { FastifyListenOptions } from "fastify/types/instance";
import * as figlet from "figlet";
import { readFileSync } from "fs";
import { build, init } from "./app";

const now = Date.now();
const pkj: { name: string; version: string } = JSON.parse(
  readFileSync("package.json", { encoding: "utf-8" }),
);
console.log(figlet.textSync("  " + pkj.name));


const start = async () => {
  try {
    await init();
    const server = build();

    const fastifyListenOptions: FastifyListenOptions = {
      port: conf.server.port,
      host: conf.server.ipv6 ? "::" : "0.0.0.0",
    };

    (await server).listen(fastifyListenOptions, (e: any) => {
      if (!e) { /* empty */ } else {
        process.exit(1);
      }
    });
  } catch (e) {
    process.exit(1);
  }
};

start();
