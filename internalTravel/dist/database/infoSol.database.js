"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificaUsuario = exports.startRegister = exports.itlVuelos = exports.itlReservas = exports.itlPasajeros = exports.itlElements = exports.getCodigosAmadeus = exports.establecerIncorrecto = exports.establecerCorrecto = exports.actualizarAmadeusSession = void 0;
const interline_oracle_datasource_1 = require("./interline.oracle.datasource");
const itlReservas = async (idReserva) => {
    const queryText = `
    select * from ITL_RESERVAS where idreserva = :idReserva`;
    const result = await (0, interline_oracle_datasource_1.query)(queryText, [idReserva]);
    return result.rows && result.rows.length > 0 ? result.rows[0] : null;
};
exports.itlReservas = itlReservas;
const itlVuelos = async (idReserva) => {
    const queryText = `
    select * from ITL_RESERVAS_vuelos where idreserva = :idReserva`;
    return (await (0, interline_oracle_datasource_1.query)(queryText, [idReserva])).rows;
};
exports.itlVuelos = itlVuelos;
const itlPasajeros = async (idReserva) => {
    const queryText = `
    select * from ITL_RESERVAS_paxes where idreserva = :idReserva`;
    return (await (0, interline_oracle_datasource_1.query)(queryText, [idReserva])).rows;
};
exports.itlPasajeros = itlPasajeros;
const itlElements = async (idReserva) => {
    const queryText = `
    select * from ITL_RESERVAS_elements where idreserva = :idReserva`;
    const result = await (0, interline_oracle_datasource_1.query)(queryText, [idReserva]);
    return result.rows;
};
exports.itlElements = itlElements;
const verificaUsuario = async (idUsuario, secretId) => {
    const bdFunction = `
    select ITL_LOGIN.login(:idUsuario, :secretId) from dual`;
    let result = await (0, interline_oracle_datasource_1.query)(bdFunction, [idUsuario, secretId]);
    result = result.rows && result.rows.length > 0 ? result.rows[0] : null;
    result = Object.values(result)[0];
    return result;
};
exports.verificaUsuario = verificaUsuario;
const startRegister = async (idReserva) => {
    const queryText = `INSERT INTO ITL_RESERVAS_LOGS_MS (IDRESERVA) VALUES (:idReserva)`;
    // return (await query(queryText, [idReserva]));
};
exports.startRegister = startRegister;
const actualizarAmadeusSession = async (idReserva, amadeusSession) => {
    const queryText = `
        UPDATE ITL_RESERVAS_LOGS_MS
        SET AMADEUSSESSION = :amadeusSession
        WHERE IDRESERVA = :idReserva`;
    // return (await query(queryText, [amadeusSession, idReserva]));
};
exports.actualizarAmadeusSession = actualizarAmadeusSession;
const establecerCorrecto = async (jsonRespuesta) => {
    const idReserva = jsonRespuesta.idReserva || jsonRespuesta.flights?.[0].idReserva || "";
    const clob = JSON.stringify(jsonRespuesta);
    const queryText = `
        UPDATE ITL_RESERVAS_LOGS_MS
        SET JSONRESPUESTA = :clob,
            CORRECTO = 'Y',
            ESTADO = 'F'
        WHERE IDRESERVA = :idReserva`;
    // return (await query(queryText, [clob, idReserva]));
};
exports.establecerCorrecto = establecerCorrecto;
const establecerIncorrecto = async (jsonRespuesta) => {
    const idReserva = jsonRespuesta.idReserva || jsonRespuesta.flights?.[0].idReserva || "";
    const clob = JSON.stringify(jsonRespuesta);
    const queryText = `
    UPDATE ITL_RESERVAS_LOGS_MS
    SET JSONRESPUESTA = :clob,
        CORRECTO = 'N',
        ESTADO = 'F'
    WHERE IDRESERVA = :idReserva`;
    // return (await query(queryText, [clob, idReserva]));
};
exports.establecerIncorrecto = establecerIncorrecto;
const getCodigosAmadeus = async (statusCode) => {
    const queryText = `
        select nvl(codigoitl,'NN') codigoBLQ, nvl(estadoservicio,'NN') estadoSVC from ama_rescodes where codigo='${statusCode}'
    `;
    const response = await (0, interline_oracle_datasource_1.query)(queryText, []);
    return response?.rows?.[0] || {};
};
exports.getCodigosAmadeus = getCodigosAmadeus;
exports.default = {
    actualizarAmadeusSession,
    establecerCorrecto,
    establecerIncorrecto,
    startRegister
};
