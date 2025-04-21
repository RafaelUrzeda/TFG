import { logger } from "aea-logger";
import fastify from "fastify";
import * as process from "node:process";
import conf from "./config/config";
import * as db from "./database/interline.oracle.datasource";
import routes from "./routes";

const init = async () => {
	try {
		await db.init({
			user: conf.datasource.user,
			connectionString: conf.datasource.connectionString,
			password: process.env.comser_db_password || '',
			poolMax: conf.datasource.poolMax
		});
	} catch (e) {
		logger.error("app init - " + e);
		process.exit(1);
	}
};

const build = () => {
	const app = fastify();
	// Routes
	routes(app).catch((e) => {
		logger.error(e);
	});
	return app;
};
export { build, init };
