"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildObject = exports.executeFunction = exports.query = exports.status = exports.init = void 0;
const aea_logger_1 = require("aea-logger");
const oracledb_1 = require("oracledb");
let pool;
/**
 * Inicializa las variables necesarias para crear la conexion a la base de datos y comprueba que sea correcta.
 * @param {Object} connectionData - Credenciales necesarias para crear conexion con la bbdd (user, password y connectionString).
 *
 * @example
 * await oracledb.init({user: 'user', password: 'password', connectionString: 'ip:host/SID'});
 */
const init = async (connectionData) => {
    aea_logger_1.logger.info(`jdbc:oracle:thin:@${connectionData.connectionString} connecting...`);
    pool = await (0, oracledb_1.createPool)(connectionData);
    await (0, exports.status)();
};
exports.init = init;
/**
 * Comprueba la conexion con la base de datos.
 * @returns {Promise<Object>} - Objeto JSON que proporciona el estado de la conexion con la bbdd
 *
 * @example
 * await status();
 */
const status = async () => {
    try {
        await (await pool.getConnection()).execute("SELECT * FROM DUAL");
        aea_logger_1.logger.info("Oracle Connected Successfully");
        return { status: "ok" };
        // eslint-disable-next-line 
    }
    catch (error) {
        aea_logger_1.logger.error("Oracle " + error);
        aea_logger_1.logger.error("Oracle " + error.stack);
        return { status: "fail" };
    }
};
exports.status = status;
const query = async (text, params) => {
    const start = Date.now();
    const connection = await pool.getConnection();
    try {
        // eslint-disable-next-line 
        const response = await connection.execute(text, params, {
            outFormat: oracledb_1.OUT_FORMAT_OBJECT,
        });
        const duration = Date.now() - start;
        // connection.commit();
        connection.close();
        aea_logger_1.logger.debug(`Oracle Executed Query: ${text}  params: ${params} duration: ${duration} ms rows: ${
        // eslint-disable-next-line 
        response.rows}`);
        return response;
        // eslint-disable-next-line 
    }
    catch (error) {
        aea_logger_1.logger.error("Query Catch Error => Oracle Query Text: " +
            text +
            " query params: " +
            JSON.stringify(params));
        connection.close();
        throw error;
    }
};
exports.query = query;
const executeFunction = async (functionName) => {
    const start = Date.now();
    const connection = await pool.getConnection();
    try {
        let bindVariables = {};
        let functionCall = `BEGIN :result := ${functionName};END;`;
        bindVariables.result = { type: oracledb_1.DB_TYPE_VARCHAR, dir: oracledb_1.BIND_OUT };
        const response = await connection.execute(functionCall, bindVariables, {
            outFormat: oracledb_1.OUT_FORMAT_OBJECT
        });
        const duration = Date.now() - start;
        if (typeof response === "object" && response !== null) {
            console.log(response);
            const idReserva = await response.outBinds.result;
            aea_logger_1.logger.debug(`Oracle Executed Function: ${functionName} duration: ${duration} ms`);
            return idReserva;
        }
        else {
            throw new Error("Invalid response from database");
        }
    }
    catch (error) {
        aea_logger_1.logger.error(`Oracle Execute Function: ${functionName}`);
        throw error;
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            }
            catch (error) {
                aea_logger_1.logger.error(`Failed to close Oracle connection: ${error}`);
            }
        }
    }
};
exports.executeFunction = executeFunction;
const buildObject = (keys, rowResults) => {
    return rowResults.map((row) => {
        // eslint-disable-next-line 
        const resultAsObject = {};
        keys.forEach((column, index) => {
            resultAsObject[column.name] = row[index];
        });
        return resultAsObject;
    });
};
exports.buildObject = buildObject;
