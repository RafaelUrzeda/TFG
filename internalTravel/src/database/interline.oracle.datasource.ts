import { logger } from "aea-logger";
import { BIND_OUT, createPool, DB_TYPE_VARCHAR, OUT_FORMAT_OBJECT, Pool, PoolAttributes } from "oracledb";

let pool: Pool;

/**
 * Inicializa las variables necesarias para crear la conexion a la base de datos y comprueba que sea correcta.
 * @param {Object} connectionData - Credenciales necesarias para crear conexion con la bbdd (user, password y connectionString).
 *
 * @example
 * await oracledb.init({user: 'user', password: 'password', connectionString: 'ip:host/SID'});
 */
export const init = async (connectionData: PoolAttributes): Promise<void> => {
	logger.info(
		`jdbc:oracle:thin:@${connectionData.connectionString} connecting...`,
	);

	pool = await createPool(connectionData);

	await status();
};

export interface Status {
	status: string;
}

/**
 * Comprueba la conexion con la base de datos.
 * @returns {Promise<Object>} - Objeto JSON que proporciona el estado de la conexion con la bbdd
 *
 * @example
 * await status();
 */
export const status = async (): Promise<Status> => {
	try {
		await (await pool.getConnection()).execute("SELECT * FROM DUAL");
		logger.info("Oracle Connected Successfully");
		return { status: "ok" };
		// eslint-disable-next-line 
	} catch (error: any) {
		logger.error("Oracle " + error);
		logger.error("Oracle " + error.stack);
		return { status: "fail" };
	}
};

export const query = async (text: string, params: (string | number)[]) => {
	const start = Date.now();
	const connection = await pool.getConnection();
	try {
		// eslint-disable-next-line 
		const response = await connection.execute<any>(text, params, {
			outFormat: OUT_FORMAT_OBJECT,
		});
		const duration = Date.now() - start;
		// connection.commit();
		connection.close();
		logger.debug(
			`Oracle Executed Query: ${text}  params: ${params} duration: ${duration} ms rows: ${
			// eslint-disable-next-line 
			(<any>response.rows)
			}`,
		);
		return response;
		// eslint-disable-next-line 
	} catch (error: any) {
		logger.error(
			"Query Catch Error => Oracle Query Text: " +
			text +
			" query params: " +
			JSON.stringify(params),
		);
		connection.close();
		throw error;
	}
};

export const executeFunction = async (
	functionName: string
): Promise<number> => {
	const start = Date.now();
	const connection = await pool.getConnection();
	try {

		let bindVariables: Record<string, any> = {};
		let functionCall = `BEGIN :result := ${functionName};END;`;

		bindVariables.result = { type: DB_TYPE_VARCHAR, dir: BIND_OUT };

		const response = await connection.execute(functionCall, bindVariables, {
			outFormat: OUT_FORMAT_OBJECT
		});
		const duration = Date.now() - start;

		if (typeof response === "object" && response !== null) {

			console.log(response)

			const idReserva = await (<any>response.outBinds).result;

			logger.debug(
				`Oracle Executed Function: ${functionName} duration: ${duration} ms`
			);

			return idReserva;
		} else {
			throw new Error("Invalid response from database");
		}

	} catch (error: any) {
		logger.error(
			`Oracle Execute Function: ${functionName}`
		);
		throw error;
	} finally {
		if (connection) {
			try {
				await connection.close();
			} catch (error) {
				logger.error(`Failed to close Oracle connection: ${error}`);
			}
		}
	}
};

export const buildObject = (
	keys: { name: string }[],
	rowResults: string[][],
) => {
	return rowResults.map((row) => {
		// eslint-disable-next-line 
		const resultAsObject = <any>{};
		keys.forEach((column: { name: string }, index: number) => {
			resultAsObject[column.name] = row[index];
		});
		return resultAsObject;
	});
};
