import fastify from "fastify";
import * as process from "node:process";
import conf from "./config/config";
import * as db from "./database/internalTravel.postgre.datasource";
import routes from "./routes";

const init = async () => {
	try {
		await db.init({
			user: conf.datasource.user,
			host: conf.datasource.host,
			port: conf.datasource.port,
			database: conf.datasource.database,
			password: "HuA6Tq3McQgPlN8ohS8unoPP485Kp8pr",
			ssl: {
				rejectUnauthorized: true,
			},
		})
	} catch (e) {
		process.exit(1);
	}
};

const build = () => {
	const app = fastify();
	// Routes
	routes(app).catch((e) => {
	});
	return app;
};
export { build, init };

