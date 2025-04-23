export interface Config {
	server: Server;
	logger: Logger;
	datasource: Datasource;
	amadeusParams: amadeusParams;
}


export interface Logger {
	exclude: string | string[];
	level: string;
	operationalTracer: boolean;
}

export interface Server {
	port: number;
	ipv6: boolean;
}

export interface Datasource {
	user: string;
	connectionString: string;
	poolMax: number;
}

export interface amadeusParams {
	officeId: string;
	dutyCode: string;
}
