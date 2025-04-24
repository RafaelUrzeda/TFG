import { executeQuery } from '../database/internalTravel.postgre.datasource';
import { Flight, SeatMapRequest } from "../interfaces/interface.index";

const formatDate = (date: string): string => {
    const day = date.substring(0, 2);
    const month = date.substring(2, 4);
    const year = '20' + date.substring(4, 6);
    return `${day}-${month}-${year}`;
};
const getSeatMap = async (booking: Flight | undefined, idFlight: string, seatMapRequest?: SeatMapRequest): Promise<any> => {
	const query = "SELECT seatmap FROM ITL_RESERVAS_SEATMAP WHERE IDRESERVA = $1";
    const values = [idFlight || ''];
    const response =  await executeQuery({ text: query, values });
    return response.rows[0]?.seatmap || null;
    //TODO: cambiar esto par ana query que recupere un seatMap de base de datos
}


export { formatDate, getSeatMap };

