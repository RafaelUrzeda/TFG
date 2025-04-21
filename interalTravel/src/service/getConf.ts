import conf from "../config/config";
import { Config } from "../config/config.interfaces";
import { operationalTracer } from "aea-logger";

const getConf = async (): Promise<Config> => {
  operationalTracer.info("getConf", { conf });
  return conf;
};

export default getConf;
