import conf from "../config/config";
import { Config } from "../config/config.interfaces";

const getConf = async (): Promise<Config> => {
  return conf;
};

export default getConf;
