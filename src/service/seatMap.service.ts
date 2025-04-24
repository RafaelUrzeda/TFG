import { getSeatMap } from '../externals/seatMap.external';
import { SeatMapRequest } from "../interfaces/interface.index";
import { buscaAsiento } from '../service/asientos.service';

const getSeatMapService = async (flight: SeatMapRequest, idFlight: string) => {
    let response;
    flight.isSeatMapRequest = true;
    if (flight.selectSeat) {
        response = await buscaAsiento(undefined, idFlight, flight);
    } else {
        response = await getSeatMap(undefined, idFlight ,flight);
    }
    return response;
}

export { getSeatMapService };

