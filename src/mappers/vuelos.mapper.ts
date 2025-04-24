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
			id: flight.nvuelo,
			seqser: parseInt(flight.seqser),
			airportCodeOrigin: flight.aptdep,
			airportCodeDestination: flight.aptarr,
			departureDate: isoDateToSpanishFormat(flight.timdep),
			flightNumber: flight.numflt,
			cabinClass: flight.clase,
			companyId: flight.ciaaerea,
			statusCode: flight.codigobloqueogyms,
			ticketsNumber: flight.pasajeros,
			llamadaGyms: flight.consultargyms,
			codigoBloqueo: [flight.codigobloqueo1, flight.codigobloqueo2, flight.codigobloqueo3].filter(codigo => codigo) as unknown as codigosBloqueo[], //TODO the what
			reservarAsientos: flight.reservarasientos
		};
	});

	itlBooking.flights.sort((a, b) => a.seqser - b.seqser);
};