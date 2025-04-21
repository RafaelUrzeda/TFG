"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapDataFlightToMultiSegmentRequest = exports.isoDateToSpanishFormat = void 0;
// Function to convert date to the correct (spanish) format
const isoDateToSpanishFormat = (dateISO) => {
    const date = new Date(dateISO);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = String(date.getUTCFullYear()).slice(-2);
    return `${day}${month}${year}`;
};
exports.isoDateToSpanishFormat = isoDateToSpanishFormat;
const mapDataFlightToMultiSegmentRequest = (itlBooking, flightData, idReserva) => {
    itlBooking.flights = flightData.map((flight) => {
        return {
            idReserva: idReserva ? idReserva.toString() : undefined,
            id: flight.NVUELO,
            seqser: parseInt(flight.SEQSER),
            airportCodeOrigin: flight.APTDEP,
            airportCodeDestination: flight.APTARR,
            departureDate: (0, exports.isoDateToSpanishFormat)(flight.TIMDEP),
            flightNumber: flight.NUMFLT,
            cabinClass: flight.CLASE,
            companyId: flight.CIAAEREA,
            statusCode: flight.CODIGOBLOQUEOGYMS,
            ticketsNumber: flight.PASAJEROS,
            llamadaGyms: flight.CONSULTARGYMS,
            codigoBloqueo: [flight.CODIGOBLOQUEO1, flight.CODIGOBLOQUEO2, flight.CODIGOBLOQUEO3].filter(codigo => codigo), //TODO the what
            reservarAsientos: flight.RESERVARASIENTOS
        };
    });
    itlBooking.flights.sort((a, b) => a.seqser - b.seqser);
};
exports.mapDataFlightToMultiSegmentRequest = mapDataFlightToMultiSegmentRequest;
