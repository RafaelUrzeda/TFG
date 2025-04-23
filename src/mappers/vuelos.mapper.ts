import { Booking, codigosBloqueo, FlightDB } from '../interfaces/interface.index';

// Function to convert date to the correct (spanish) format
export const isoDateToSpanishFormat = (dateISO: string): string => {
	const date = new Date(dateISO);
	const day = String(date.getUTCDate()).padStart(2, '0');
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const year = String(date.getUTCFullYear()).slice(-2);
	return `${day}${month}${year}`;
};

export const mapDataFlightToMultiSegmentRequest = (itlBooking: Booking, flightData: FlightDB[], idReserva?: number) => {
	itlBooking.flights = flightData.map((flight) => {
		return {
			idReserva: idReserva ? idReserva.toString() : undefined,
			id: flight.NVUELO,
			seqser: parseInt(flight.SEQSER),
			airportCodeOrigin: flight.APTDEP,
			airportCodeDestination: flight.APTARR,
			departureDate: isoDateToSpanishFormat(flight.TIMDEP),
			flightNumber: flight.NUMFLT,
			cabinClass: flight.CLASE,
			companyId: flight.CIAAEREA,
			statusCode: flight.CODIGOBLOQUEOGYMS,
			ticketsNumber: flight.PASAJEROS,
			llamadaGyms: flight.CONSULTARGYMS,
			codigoBloqueo: [flight.CODIGOBLOQUEO1, flight.CODIGOBLOQUEO2, flight.CODIGOBLOQUEO3].filter(codigo => codigo) as unknown as codigosBloqueo[], //TODO the what
			reservarAsientos: flight.RESERVARASIENTOS
		};
	});

	itlBooking.flights.sort((a, b) => a.seqser - b.seqser);
};