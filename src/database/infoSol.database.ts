import { Booking } from '../interfaces/interface.index';
import { executeQuery } from './internalTravel.postgre.datasource';

const itlReservas = async (idReserva: number) => {
    const queryText = `
    select * from ITL_RESERVAS where idreserva = :idReserva`;
    const result = await executeQuery({ text: queryText, values: [idReserva] });
    return result.rows && result.rows.length > 0 ? result.rows[0] : null;
};

const itlVuelos = async (idReserva: number) => {
    const queryText = `
    select * from ITL_RESERVAS_vuelos where idreserva = :idReserva`;
    return (await executeQuery({ text: queryText, values: [idReserva] })).rows;
};

const itlPasajeros = async (idReserva: number) => {
    const queryText = `
    select * from ITL_RESERVAS_paxes where idreserva = :idReserva`;
    return (await executeQuery({ text: queryText, values: [idReserva] })).rows;
};

const itlElements = async (idReserva: number) => {
    const queryText = `
    select * from ITL_RESERVAS_elements where idreserva = :idReserva`;
    const result = await executeQuery({ text: queryText, values: [idReserva] });
    return result.rows;
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

export {
    actualizarAmadeusSession,
    establecerCorrecto,
    establecerIncorrecto,
    itlElements,
    itlPasajeros,
    itlReservas,
    itlVuelos,
    startRegister
};

export default {
    actualizarAmadeusSession,
    establecerCorrecto,
    establecerIncorrecto,
    startRegister
}