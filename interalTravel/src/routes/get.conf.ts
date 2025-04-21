import { FastifyInstance } from "fastify";
import getConfService from "../service/getConf";

const getConf = (app: FastifyInstance): void => {
  app.get("/conf", async (req, res) => {
    return res.send(await getConfService());
  });
};

module.exports = getConf;
