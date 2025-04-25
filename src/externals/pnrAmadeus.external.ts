import { executeQuery } from '../database/internalTravel.postgre.datasource';

export const getAmadeusPNR = async (localizador: string | number): Promise<any> => {
	const query = "SELECT * FROM ITL_RESERVAS_AMADEUS WHERE IDRESERVA = $1";
    const values = [localizador];
    return (await executeQuery({ text: query, values })).rows[0].amadeusbooking || null;
};