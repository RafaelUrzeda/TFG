import { getSeatMap } from '../externals/seatMap.external';
import { SeatMapRequest } from "../interfaces/interface.index";
import { buscaAsiento } from '../service/asientos.service';

const getSeatMapService = async (flight: SeatMapRequest, token: string) => {
    let response;
    flight.isSeatMapRequest = true;
    if (flight.selectSeat) {
        response = await buscaAsiento(undefined, flight);
    } else {
        response = await getSeatMap(undefined, flight);
    }
    return response;
}

export { getSeatMapService };

