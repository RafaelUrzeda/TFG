import { Booking } from '../interfaces/interface.index';
import { query } from './interline.oracle.datasource';

const itlReservas = async (idReserva: number) => {
    const queryText = `
    select * from ITL_RESERVAS where idreserva = :idReserva`;
    const result = await query(queryText, [idReserva]);
    return result.rows && result.rows.length > 0 ? result.rows[0] : null;
};

const itlVuelos = async (idReserva: number) => {
    const queryText = `
    select * from ITL_RESERVAS_vuelos where idreserva = :idReserva`;
    return (await query(queryText, [idReserva])).rows;
};

const itlPasajeros = async (idReserva: number) => {
    const queryText = `
    select * from ITL_RESERVAS_paxes where idreserva = :idReserva`;
    return (await query(queryText, [idReserva])).rows;
};

const itlElements = async (idReserva: number) => {
    const queryText = `
    select * from ITL_RESERVAS_elements where idreserva = :idReserva`;
    const result = await query(queryText, [idReserva]);
    return result.rows;
};

const verificaUsuario = async (idUsuario: string, secretId: string) => {
    const bdFunction = `
    select ITL_LOGIN.login(:idUsuario, :secretId) from dual`;
    let result = await query(bdFunction, [idUsuario, secretId]);
    result = result.rows && result.rows.length > 0 ? result.rows[0] : null;
    result = Object.values(result)[0];
    return result;
};

const startRegister = async (idReserva: number) => {
    const queryText = `INSERT INTO ITL_RESERVAS_LOGS_MS (IDRESERVA) VALUES (:idReserva)`;
    // return (await query(queryText, [idReserva]));
};

const actualizarAmadeusSession = async (idReserva: number, amadeusSession: string) => {
    const queryText = `
        UPDATE ITL_RESERVAS_LOGS_MS
        SET AMADEUSSESSION = :amadeusSession
        WHERE IDRESERVA = :idReserva`;
    // return (await query(queryText, [amadeusSession, idReserva]));
};

const establecerCorrecto = async (jsonRespuesta: Booking) => {
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

const establecerIncorrecto = async (jsonRespuesta: Booking) => {
    const idReserva = jsonRespuesta.idReserva || jsonRespuesta.flights?.[0].idReserva || "";
    const clob = JSON.stringify(jsonRespuesta);
    const queryText = `
    UPDATE ITL_RESERVAS_LOGS_MS
    SET JSONRESPUESTA = :clob,
        CORRECTO = 'N',
        ESTADO = 'F'
    WHERE IDRESERVA = :idReserva`;
    // return (await query(queryText, [clob, idReserva]));
}

const getCodigosAmadeus = async (statusCode: string) => {
    const queryText = `
        select nvl(codigoitl,'NN') codigoBLQ, nvl(estadoservicio,'NN') estadoSVC from ama_rescodes where codigo='${statusCode}'
    `;
    const response = await query(queryText, []);
    return response?.rows?.[0] || {};
}

export {
    actualizarAmadeusSession,
    establecerCorrecto,
    establecerIncorrecto,
    getCodigosAmadeus,
    itlElements,
    itlPasajeros,
    itlReservas,
    itlVuelos,
    startRegister,
    verificaUsuario
};

export default {
    actualizarAmadeusSession,
    establecerCorrecto,
    establecerIncorrecto,
    startRegister
}