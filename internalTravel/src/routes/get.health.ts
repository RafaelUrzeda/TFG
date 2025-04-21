import { FastifyInstance } from "fastify";

const getHealth = (app: FastifyInstance) => {
  app.get("/health", async (req, res) => {
    const jRes = {
      status: "UP",
    };
    return res.send(jRes);
  });
};

module.exports = getHealth;
