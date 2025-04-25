import { getAmadeus } from '../externals/ITLamadeus.external';
import { getAmadeusPNR } from '../externals/pnrAmadeus.external';
import { Adult, Booking, BookingData, ElementsDB, FlightDB, PaxesDB } from '../interfaces/interface.index';
import { mapPaxes } from '../mappers/pasajeros.mapper';
import { mapContactInformation, mapResidentDiscount, mapRF, mapSsrToRoot } from '../mappers/ssr.mapper';
import { mapDataFlightToMultiSegmentRequest } from '../mappers/vuelos.mapper';
import { dataBooking, dataFlight, dataPaxes, dataSsr } from './database.service';
import { deleteElements } from './procesaPnr.service';

let IdReserva: number | string = 0;

const fullItlUpdateBookingService = async (idReserva: number, token: string, localizador: string): Promise<string> => {
	const amaData: any = {
		pnr: null,
		headers: null,
		amadeussession: null,
		token: token,
		locata: localizador
	};
	const itlBooking: Booking = {} as Booking;

	const [bookingData, paxes, elements, flight] = await getDataBaseData(idReserva);

	IdReserva = idReserva ;
	itlBooking.idReserva = idReserva.toString();
	itlBooking.idSolicitud = bookingData.IDSOLICITUD;


	await getPNR(IdReserva);
	console.log(JSON.stringify(amaData.pnr));

	addDataToBooking(itlBooking, elements, paxes, flight, IdReserva, amaData.pnr);

	// process passengers
	// const nuCommands = await mapTravellerInfoFomDB(itlBooking);
	// await executeCommandList(nuCommands, token, amaData);

	//update object pnr
	// await sanitizeAmadeusErrors(amaData);
	// await getPNR(amaData);

	syncPassengerIds(itlBooking, amaData.pnr);

	// delete elements from pnr
	const responseDeletedElements = await deleteElements(amaData.pnr);
	amaData.amadeussession = responseDeletedElements;

	// add elements to booking object	
	addElementsToBookingObject(itlBooking, elements);

	itlBooking.tkok = true;
	// const booking = await finishBooking(itlBooking);
	itlBooking.PNR = amaData.pnr || '';
	return JSON.stringify(itlBooking);
};

const addDataToBooking = (itlBooking: Booking, elements: ElementsDB[], paxes: PaxesDB[], flight: FlightDB[], idReserva: number, pnr: any) => {
	mapPaxes(paxes, itlBooking);
	mapDataFlightToMultiSegmentRequest(itlBooking, flight, idReserva);
	syncFlightIds(itlBooking, pnr)
	addElementsToBookingObject(itlBooking, elements);
}

const getPNR = async (amaData: any) => {
	let response;
	if (amaData.amadeussession !== null) {
		response = await getAmadeusPNR(amaData.locata);
	} else {
		response = await getAmadeusPNR(amaData.locata);
	}
	amaData.pnr = response;
}

export const getDataBaseData = async (idBooking: number): Promise<[BookingData, PaxesDB[], ElementsDB[], FlightDB[]]> => {
	const paxes: PaxesDB[] = await dataPaxes(idBooking);
	const elements: ElementsDB[] = await dataSsr(idBooking);
	const bookingData: BookingData = await dataBooking(idBooking);
	const flight: FlightDB[] = await dataFlight(idBooking);
	return [bookingData, paxes, elements, flight];
};

const mapTravellerInfoFomDB = async (pasajerosMapped: Booking): Promise<string[]> => {
	const nuCommand: string[] = [];
	pasajerosMapped.adults?.forEach((pax: any) => {
		nuCommand.push(`NU${pax.id}/1${pax.nombreAmadeus}`);
	});

	pasajerosMapped.childs?.forEach((pax: any) => {
		nuCommand.push(`NU${pax.id}/1${pax.nombreAmadeus}`);
	});
	return nuCommand;
}

// TODO solucion temporal, es para funcione o no el NU se sanee la sesion
export const sanitizeAmadeusErrors = async (amaData: any) => {
	const newItlBooking: Booking = {};
	newItlBooking.ignorePNR = true;

	const response = await getAmadeus(IdReserva);
	amaData.amadeussession = response;
};

const executeCommandList = async (nuCommands: string[], token: string, amaData: any): Promise<any> => {
	// for (let i = 0; i < nuCommands.length; i++) {
	// 	const command = nuCommands[i];
	// 	const response = await postAmadeusCommand(command, token, amaData.amadeussession);
	// 	amaData.amadeussession = response?.headers.amadeussession || '';
	// }

	// const rfCommand = "RF Updated Name Interline API"
	// const rfResponse = await postAmadeusCommand(rfCommand, token, amaData.amadeussession);
	// amaData.amadeussession = rfResponse?.headers.amadeussession

	// const etCommand = "ET"
	// const etResponse = await postAmadeusCommand(etCommand, token, amaData.amadeussession);
	// amaData.amadeussession = etResponse?.headers.amadeussession
};

const addElementsToBookingObject = (itlBooking: Booking, elementsData: ElementsDB[]) => {
	const conditions = [
		'FD',
		'FZ',
		'DOCS',
		'CTCE',
		'APE',
		'CTCM',
		'CKIN',
		'AP',
		'SR',
		'FP',
		'RF'
	];
	const elementosToMap = elementsData.filter((element) =>
		conditions.some((condition) => condition === element.tipoelemento)
	);

	mapSsrToRoot(elementosToMap, itlBooking);
	mapResidentDiscount(elementosToMap, itlBooking);
	mapContactInformation(elementsData, itlBooking);
	mapRF(elementsData, itlBooking);
}

const syncFlightIds = (itlBooking: Booking, Pnr: any) => {

	itlBooking.flights?.forEach((flight) => {

		const foundBookedFlight = Pnr.originDestinationDetails[0].itineraryInfo.find((bookedFlight: any) => {

			const isDestinationAirportOK = flight.airportCodeDestination.toUpperCase() === bookedFlight.travelProduct.offpointDetail.cityCode.toUpperCase();
			const isDepartureAirportOk = flight.airportCodeOrigin.toUpperCase() === bookedFlight.travelProduct.boardpointDetail.cityCode.toUpperCase()
			const isDepartureDateOk = flight.departureDate === bookedFlight.travelProduct.product.depDate
			const isNumFlightOk = flight.flightNumber.toString().replace(/^0+/, '') === bookedFlight.travelProduct.productDetails.identification.toString().replace(/^0+/, '')

			return isDepartureAirportOk && isDestinationAirportOK && isDepartureDateOk && isNumFlightOk
		})

		if (foundBookedFlight) flight.amadeusId = foundBookedFlight.elementManagementItinerary.reference.number
	})
}

const syncPassengerIds = (itlBooking: Booking, Pnr: any) => {

	itlBooking.adults?.forEach(passenger => {
		const foundBookedPassenger = Pnr.travellerInfo.find((bookedPassenger: any) => {
			return findPassenger(passenger, bookedPassenger, undefined)
		})
		if (foundBookedPassenger) passenger.amadeusId = foundBookedPassenger.elementManagementPassenger.reference.number
	})

	itlBooking.childs?.forEach(passenger => {
		const foundBookedPassenger = Pnr.travellerInfo.find((bookedPassenger: any) => {
			return findPassenger(passenger, bookedPassenger, 'CHD')
		})
		if (foundBookedPassenger) passenger.amadeusId = foundBookedPassenger.elementManagementPassenger.reference.number
	})

}

const findPassenger = (passenger: any, bookedPassenger: any, typeOfPassenger?: string) => {

	const isSurnameOk = bookedPassenger?.passengerData[0]?.travellerInformation?.traveller?.surname?.toUpperCase() === passenger.surname.toUpperCase()
	const isFirstNameOk = bookedPassenger?.passengerData[0]?.travellerInformation?.passenger[0]?.firstName?.toUpperCase() === passenger.firstName.toUpperCase()
	let isTypeOfPassengerOk

	if (!typeOfPassenger) {
		isTypeOfPassengerOk = bookedPassenger?.passengerData[0]?.travellerInformation?.passenger[0]?.type === undefined
	} else {
		isTypeOfPassengerOk = bookedPassenger?.passengerData[0]?.travellerInformation?.passenger[0]?.type === typeOfPassenger
	}

	return isSurnameOk && isFirstNameOk && isTypeOfPassengerOk
}


export const mapTravellerInfo = async (PNR: any, pasajerosMapped: Booking): Promise<string[]> => {

	const unUpdatedPassengers: { lineNumber: number; referenceId: string; firstName: string; surname: string; }[] = [];

	const nuCommands: string[] = [];

	PNR.travellerInfo.forEach((traveller: any) => {

		const referenceId: string = traveller.elementManagementPassenger.reference.number;
		const lineNumber: number = traveller.elementManagementPassenger.lineNumber;

		let foundMatch: boolean = false;

		traveller.passengerData.forEach((passenger: any) => {

			const { traveller, passenger: passengerList } = passenger.travellerInformation;

			passengerList.forEach((pax: any) => {

				const firstName: string = pax.firstName.trim().toUpperCase();
				const surname: string = traveller.surname.trim().toUpperCase();

				const matchingPassenger = [...(pasajerosMapped.adults || []), ...(pasajerosMapped.childs || [])].find(p =>
					p.firstName.trim().toUpperCase() === firstName &&
					p.surname.trim().toUpperCase() === surname
				);

				if (matchingPassenger) {
					foundMatch = true;
				}
			});
		});

		if (!foundMatch) {
			unUpdatedPassengers.push({
				lineNumber, referenceId,
				firstName: '',
				surname: ''
			});
		}
	});


	// TODO Too many somes
	(pasajerosMapped.adults || []).concat((pasajerosMapped.childs || []).map(child => ({
		...child,
		hasInfants: false
	} as Adult))).forEach(pasajero => {
		const notInPNR = !PNR.travellerInfo.some((traveller: { passengerData: any[]; }) =>
			traveller.passengerData.some((passenger: { travellerInformation: { passenger: any[]; traveller: { surname: string; }; }; }) =>
				passenger.travellerInformation.passenger.some((pax: { firstName: string; }) =>
					pax.firstName.trim().toUpperCase() === pasajero.firstName.trim().toUpperCase() &&
					passenger.travellerInformation.traveller.surname.trim().toUpperCase() === pasajero.surname.trim().toUpperCase()
				)
			)
		);
		if (notInPNR) {
			const lineNumber = unUpdatedPassengers.length > 0 ? unUpdatedPassengers[0].lineNumber : 1;
			nuCommands.push(`NU${lineNumber}/1${pasajero.surname}/${pasajero.firstName}`);
		}
	});

	return nuCommands;
}




export { fullItlUpdateBookingService };

