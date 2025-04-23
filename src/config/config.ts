import { Config } from "./config.interfaces";

const get: Config = {
	server: {
		port: 3000,
		ipv6: false,
	},
	logger: {
		exclude: "/health",
		level: "info",
		operationalTracer: false,
	},
	datasource: {
		poolMax: 10,
		user: 'root',
		connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=aqui el host)(PORT=1234))(CONNECT_DATA=(SID=Root)))"
	},
	amadeusParams: {
		officeId: '1234',
		dutyCode: 'pp'
	}
};

export default get;
