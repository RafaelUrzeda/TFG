import { getGyms } from '../externals/gyms.external';
import { getAmadeus } from '../externals/ITLamadeus.external';
import { Adult, Booking, Child, Flight, ProcessFlight } from '../interfaces/interface.index';

// main function in add flight process
export const processAndAddFlight = async (itlBooking: Booking): Promise<ProcessFlight> => {
	let response: ProcessFlight | Promise<ProcessFlight>;
	let amadeusSession: string | undefined;
	let allOkInBookingProcess = true;
	let contador = 0;

	for (const flight of itlBooking.flights || []) {
		console.log('flight', flight);
		flight.amadeusErrorCode = [];
		flight.gymsResponse = {};

        const resultado: { successCallToExternalServices: boolean; allOkInBookingProcess: boolean; amadeusSession: string | undefined; errorCode: string; flight: Flight; gymsResponse?: any } =
            await processFlight(flight, amadeusSession, contador);

		allOkInBookingProcess = resultado.allOkInBookingProcess;

		amadeusSession = resultado.amadeusSession;
		console.log('resultado', resultado);
        if (!allOkInBookingProcess) {
            return response = processFail(itlBooking, amadeusSession);
        }

		contador++;
	};

	response = { itlBooking, amadeusSession, allOkInBookingProcess }

	return response;
};

// Variables Generales
const LEADING_ZERO = /^0+/;
const FREE_TEXT_AMA_ERROR = 'TICKET RECONCILIATION NEEDED';
const GYMS_CALL = 'S';
const FORCE_IS_POSSIBLE_YES = 'S';
const FORCE_IS_POSSIBLE_NO = 'N';
const DEFAULT_ERROR_CODE = 'N/A';
const DEFAULT_ERROR_CATEGORY = 'N/A';
const DEFAULT_ERROR_OWNER = 'N/A';



// Procesar cada flight individualmente
const processFlight = async (flight: Flight, amadeusSession: string | undefined, contador: number) => {
    let response: {
        successCallToExternalServices: boolean;
        allOkInBookingProcess: boolean;
        amadeusSession: string | undefined;
        errorCode: string;
        flight: Flight;
    }
    if (flight.llamadaGyms === GYMS_CALL) {
        // Verificamos si el campo forceIsPossible existe en la respuesta
        const bloqueo = await getGyms(flight) || { forceIsPossible: FORCE_IS_POSSIBLE_NO, gyms: {} };
        // Verificamos si el campo forceIsPossible existe, si no, lo creamos con valor 'N'
        if (bloqueo.gyms) {
            flight.gymsResponse = { gyms: "No se ha podido obtener la respuesta de Gyms" };
        } else {
            flight.gymsResponse = bloqueo;
        }
        if (bloqueo.forceIsPossible === FORCE_IS_POSSIBLE_YES) {
            const resultadoAmadeus = await llamarAmadeus(flight, amadeusSession, contador);
            if (!resultadoAmadeus.successCallToExternalServices) {
                response = await intentarConCodigoBloqueo(flight, resultadoAmadeus.amadeusSession, contador);
            } else {
                response = { ...resultadoAmadeus, flight };
            }
        } else {
            response = await intentarConCodigoBloqueo(flight, amadeusSession, contador);
        }
    } else {
        response = await intentarConCodigoBloqueo(flight, amadeusSession, contador);
    }
    return response;
};

// Llamar al servicio Amadeus
const llamarAmadeus = async (flight: Flight, amadeusSession: string | undefined, contador: number) => {
	const { data: response, headers } = await getAmadeus({ flights: [flight] }, amadeusSession);

    let successCallToExternalServices = false;
    let allOkInBookingProcess = true;
    let errorCode = '';

	if (response) {
		if (headers.amadeussession) {
			amadeusSession = headers.amadeussession;
		}

		const errorFreeText = syncFlightIds(flight, response.pnr);
		successCallToExternalServices = true;
		if (!hasError(errorFreeText)) {
			allOkInBookingProcess = false;
			errorCode = errorFreeText;
			flight.amadeusErrorCode?.push({ amadeusErrorCode: errorCode, statusCode: flight.statusCode });
		}
	}

	return { successCallToExternalServices, allOkInBookingProcess, amadeusSession, errorCode };
};
// Actualizar flight con los datos de Amadeus
const syncFlightIds = (flight: Flight, Pnr: any) => {
	let errorFreeText: string = '';
	const foundBookedFlight = Pnr.originDestinationDetails[0].itineraryInfo.find((bookedFlight: any) => {

        const isDestinationAirportOK = flight.airportCodeDestination.toUpperCase() === bookedFlight.travelProduct.offpointDetail.cityCode.toUpperCase();
        const isDepartureAirportOk = flight.airportCodeOrigin.toUpperCase() === bookedFlight.travelProduct.boardpointDetail.cityCode.toUpperCase();
        const isDepartureDateOk = flight.departureDate === bookedFlight.travelProduct.product.depDate;
        const isNumFlightOk = flight.flightNumber.toString().replace(LEADING_ZERO, '') === bookedFlight.travelProduct.productDetails.identification.toString().replace(LEADING_ZERO, '');
        return isDepartureAirportOk && isDestinationAirportOK && isDepartureDateOk && isNumFlightOk;
    })

    if (foundBookedFlight) {
        errorFreeText = foundBookedFlight.errorInfo?.errorWarningDescription.freeText;
        if (!hasError(errorFreeText)) {
            flight.amadeusId = foundBookedFlight.elementManagementItinerary.reference.number;
            flight.fullArrivalDate = formatDate(foundBookedFlight.travelProduct.product.arrDate, foundBookedFlight.travelProduct.product.arrTime);
            flight.fullDepartureDate = formatDate(foundBookedFlight.travelProduct.product.depDate, foundBookedFlight.travelProduct.product.depTime);
            flight.amadeusStatusCode = foundBookedFlight.relatedProduct.status[0];
        }
    }
    return errorFreeText;
}

// TODO: puede que el error este aqui
// Intentar con códigos de bloqueo 
const intentarConCodigoBloqueo = async (flight: Flight, amadeusSession: string | undefined, contador: number) => {
	let errorCode = '';
	let response = { successCallToExternalServices: false, allOkInBookingProcess: false, amadeusSession, errorCode, flight };


	for (const codigoBloqueo of flight.codigoBloqueo) {
		flight.statusCode = codigoBloqueo?.toString();
		const { successCallToExternalServices, amadeusSession: nuevaSesion, errorCode: newErrorCode } = await llamarAmadeus(flight, amadeusSession, contador);

		amadeusSession = nuevaSesion;

		if (newErrorCode) {
			errorCode = newErrorCode;
		}

		if (successCallToExternalServices) {
			response = { successCallToExternalServices: true, allOkInBookingProcess: true, amadeusSession, errorCode: '', flight };
			break;
		}
	}


	return response;
};

// Chequear si hay error en la respuesta
const hasError = (freeText: string | undefined): boolean => {
	return freeText !== null && freeText !== FREE_TEXT_AMA_ERROR && freeText !== undefined && freeText[0] !== undefined;
};

// Process Amadeus Error
export const processFail = async (itlBooking: Booking, amadeusSession: string | undefined): Promise<ProcessFlight> => {
	const newItlBooking: Booking = {};
	newItlBooking.ignorePNR = true;
	await getAmadeus(newItlBooking, amadeusSession);
	return { itlBooking, amadeusSession, allOkInBookingProcess: false };
};

// Format date to correct format (spanish)
const formatDate = (dateStr: string, timeStr: string): string => {
	const day = dateStr.substring(0, 2);
	const month = dateStr.substring(2, 4);
	const year = '20' + dateStr.substring(4, 6);

	const hours = timeStr.substring(0, 2);
	const minutes = timeStr.substring(2, 4);

	return `${day}/${month}/${year} ${hours}:${minutes}`;
}


export const finishBooking = async (itlBooking: Booking, amadeusSession: string | undefined) => {
	try {
		return await getAmadeus(itlBooking, amadeusSession);
	} catch (error) {
		return false;
	}
};

const addPassengers = async (
	passengers: Adult[] | Child[] | Booking,
	amadeusSession: string | undefined
) => {
	try {

		const { data: response, headers } = await getAmadeus(passengers, amadeusSession);
		return response ? { data: response, headers } : null;
	} catch (error) {
		throw error;
	}
};


export const processAndAddPaxes = (
	itlBooking: Booking,
	data: any,
	type: "adults" | "childs",
) => {
	let allOkInBookingProcess = true;
	const pnr = data.pnr;
	const passengers = itlBooking[type];
	if (!passengers || passengers.length === 0) {
		console.warn(`No se encontraron pasajeros para ${type}.`);
		return { allOkInBookingProcess };
	}

	if (!pnr?.travellerInfo) {
		console.warn(`No se encontraron datos de travellerInfo en el PNR para ${type}.`);
		return { allOkInBookingProcess };
	}

	pnr.travellerInfo.forEach((traveller: any) => {
		const errorDetails = traveller?.nameError?.errorOrWarningCodeDetails?.errorDetails;
		const freeText = traveller?.nameError?.errorWarningDescription?.freeText?.join(" ") || "";
		const passengerData = traveller?.passengerData?.[0]?.travellerInformation;

		const surname = passengerData?.traveller?.surname;
		const firstName = passengerData?.passenger?.[0]?.firstName;
		const referenceNumber = traveller?.elementManagementPassenger?.reference?.number;

		passengers.forEach(passenger => {
			if (
				passenger.firstName?.toUpperCase() === firstName?.toUpperCase() &&
				passenger.surname?.toUpperCase() === surname?.toUpperCase()
			) {
				passenger.amadeusId = referenceNumber;
				if (errorDetails) {
					allOkInBookingProcess = false;
					passenger.amaError = {
						errorCode: errorDetails?.errorCode || DEFAULT_ERROR_CODE,
						category: errorDetails?.errorCategory || DEFAULT_ERROR_CATEGORY,
						owner: errorDetails?.errorCodeOwner || DEFAULT_ERROR_OWNER,
						description: freeText,
					};
				}
			}
		});
	});

	itlBooking[type] = passengers as Adult[] & Child[];

	return { allOkInBookingProcess };
};


export const processPassengers = async (
	itlBooking: Booking,
	amadeusSession: string | undefined
) => {
    try {
        let newAmadeusSession: string = '';
        let allOkInBookingProcess = true;
        if (itlBooking.adults && itlBooking.adults.length > 0) {
            const response = await addPassengers({ adults: itlBooking.adults }, amadeusSession);
            const result = processAndAddPaxes(itlBooking, response?.data, "adults");
			if (response) {
				const { data, headers } = response;
				newAmadeusSession = headers.amadeussession;
			}
            allOkInBookingProcess = allOkInBookingProcess && result.allOkInBookingProcess;
        }

        if (itlBooking.childs && itlBooking.childs.length > 0) {
            const filteredBooking: Booking = {
                adults: itlBooking.adults,
                childs: itlBooking.childs
            };
            const passengerResponse = await addPassengers(filteredBooking, amadeusSession);
            if (passengerResponse) {
                const { data, headers } = passengerResponse;
                newAmadeusSession = headers.amadeussession;

				const result = processAndAddPaxes(itlBooking, data, "childs");
				allOkInBookingProcess = allOkInBookingProcess && result.allOkInBookingProcess;
			}
		}

		return { itlBooking, allOkInBookingProcess, newAmadeusSession };// devuelves la nueva pero que solo se habrá puesto si vienen niños
	} catch (error) {
		throw error;
	}
};
