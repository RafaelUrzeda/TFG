import { executeQuery } from './internalTravel.postgre.datasource';

const itlReservas = async (idReserva: number) => {
    const queryText = `
    select * from ITL_RESERVAS where idreserva = $1`;
    const result = await executeQuery({ text: queryText, values: [idReserva] });
    return result.rows && result.rows.length > 0 ? result.rows[0] : null;
};

const itlVuelos = async (idReserva: number) => {
    const queryText = `
    select * from ITL_RESERVAS_vuelos where idreserva = $1`;
    return (await executeQuery({ text: queryText, values: [idReserva] })).rows;
};

const itlPasajeros = async (idReserva: number) => {
    const queryText = `
    select * from ITL_RESERVAS_paxes where idreserva = $1`;
    return (await executeQuery({ text: queryText, values: [idReserva] })).rows;
};

const itlElements = async (idReserva: number) => {
    const queryText = `
    select * from ITL_RESERVAS_elements where idreserva = $1`;
    const result = await executeQuery({ text: queryText, values: [idReserva] });
    return result.rows;
};



export {
    itlElements,
    itlPasajeros,
    itlReservas,
    itlVuelos
};
