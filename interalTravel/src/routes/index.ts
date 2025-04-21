import { logger } from "aea-logger";
import { FastifyInstance } from "fastify";
import * as fs from "fs";
import * as path from "path";

const basename = path.basename(__filename);
const routes = async (app: FastifyInstance): Promise<void> => {
  logger.info("Routes");
  const files = fs.readdirSync(__dirname).filter((file) => {
    return file.indexOf(".") !== 0 && file !== basename;
  });

  try {
    for (const file of files) {
      const directoryMainRouteFile = `./${file}`;
      const routeModule = await import(directoryMainRouteFile);
      routeModule(app);
      logger.info("    |--> [Load] " + file);
    }
  } catch (error) {
    logger.error("Error loading routes: " + error);
    process.exit(1);
  }
};

export default routes;
