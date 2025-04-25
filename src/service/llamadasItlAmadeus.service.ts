import { getGyms } from '../externals/gyms.external';
import { getAmadeus } from '../externals/ITLamadeus.external';
import { Adult, Booking, Child, Flight, ProcessFlight } from '../interfaces/interface.index';

let idReserva: string | number = 0;
// main function in add flight process
export const processAndAddFlight = async (itlBooking: Booking): Promise<ProcessFlight> => {
	let response: ProcessFlight | Promise<ProcessFlight>;
	let allOkInBookingProcess = true;
	let contador = 0;
	idReserva = itlBooking.idReserva || 0;
	for (const flight of itlBooking.flights || []) {
		flight.amadeusErrorCode = [];
		flight.gymsResponse = {};
        const resultado: { successCallToExternalServices: boolean; allOkInBookingProcess: boolean; errorCode: string; flight: Flight; gymsResponse?: any } =
            await processFlight(flight, contador);

		allOkInBookingProcess = resultado.allOkInBookingProcess;

        if (!allOkInBookingProcess) {
            return response = processFail(itlBooking);
        }

		contador++;
	};
	response = { itlBooking, allOkInBookingProcess }

	return response;
};

// Variables Generales
const LEADING_ZERO = /^0+/;
const FREE_TEXT_AMA_ERROR = 'TICKET RECONCILIATION NEEDED';
const GYMS_CALL = 'NO';
const FORCE_IS_POSSIBLE_YES = 'S';
const FORCE_IS_POSSIBLE_NO = 'N';
const DEFAULT_ERROR_CODE = 'N/A';
const DEFAULT_ERROR_CATEGORY = 'N/A';
const DEFAULT_ERROR_OWNER = 'N/A';



// Procesar cada flight individualmente
const processFlight = async (flight: Flight, contador: number) => {
    let response: {
        successCallToExternalServices: boolean;
        allOkInBookingProcess: boolean;
        errorCode: string;
        flight: Flight;
    }
    if (flight.llamadaGyms === GYMS_CALL) {
        // Verificamos si el campo forceIsPossible existe en la respuesta
        const bloqueo = await getGyms(flight) || { forceIsPossible: FORCE_IS_POSSIBLE_NO, gyms: {} };
        // Verificamos si el campo forceIsPossible existe, si no, lo creamos con valor 'N'
        if (bloqueo) {
            flight.gymsResponse = { gyms: "No se ha podido obtener la respuesta de Gyms" };
        } else {
            flight.gymsResponse = bloqueo;
        }
        if (bloqueo) {
            const resultadoAmadeus = await llamarAmadeus(flight, contador);
            if (!resultadoAmadeus.successCallToExternalServices) {
                response = await intentarConCodigoBloqueo(flight, contador);
            } else {
                response = { ...resultadoAmadeus, flight };
            }
        } else {
            response = await intentarConCodigoBloqueo(flight, contador);
        }
    } else {
        response = await intentarConCodigoBloqueo(flight, contador);
    }
    return response;
};

// Llamar al servicio Amadeus

const llamarAmadeus = async (flight: Flight, contador: number) => {
	const response = await getAmadeus(idReserva);

    let successCallToExternalServices = false;
    let allOkInBookingProcess = true;
    let errorCode = '';

	if (response) {

		const errorFreeText = syncFlightIds(flight, response);
		successCallToExternalServices = true;
		if (hasError(errorFreeText)) {
			allOkInBookingProcess = false;
			errorCode = errorFreeText;
			flight.amadeusErrorCode?.push({ amadeusErrorCode: errorCode, statusCode: flight.statusCode });
		}
	}

	return { successCallToExternalServices, allOkInBookingProcess, errorCode };
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
const intentarConCodigoBloqueo = async (flight: Flight, contador: number) => {
	let errorCode = '';
	let response = { successCallToExternalServices: false, allOkInBookingProcess: false,  errorCode, flight };


	for (const codigoBloqueo of flight.codigoBloqueo) {
		flight.statusCode = codigoBloqueo?.toString();
		const { successCallToExternalServices, errorCode: newErrorCode } = await llamarAmadeus(flight, contador);


		if (newErrorCode) {
			errorCode = newErrorCode;
		}

		if (successCallToExternalServices) {
			response = { successCallToExternalServices: true, allOkInBookingProcess: true, errorCode: '', flight };
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
export const processFail = async (itlBooking: Booking, ): Promise<ProcessFlight> => {
	const newItlBooking: Booking = {};
	newItlBooking.ignorePNR = true;
	await getAmadeus(idReserva);
	return { itlBooking, allOkInBookingProcess: false };
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


export const finishBooking = async (itlBooking: Booking) => {
	try {
		return await getAmadeus(idReserva);
	} catch (error) {
		return false;
	}
};

const addPassengers = async (
	passengers: Adult[] | Child[] | Booking,
) => {
	// eslint-disable-next-line no-useless-catch
	try {
		const response= await getAmadeus(idReserva);
		return response;
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
	const pnr = data;
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
) => {
    // eslint-disable-next-line no-useless-catch
    try {
        let allOkInBookingProcess = true;
		idReserva = itlBooking.idReserva || 0;
        if (itlBooking.adults && itlBooking.adults.length > 0) {
            const response = await addPassengers({ adults: itlBooking.adults });
            const result = processAndAddPaxes(itlBooking, response, "adults");
            allOkInBookingProcess = allOkInBookingProcess && result.allOkInBookingProcess;
        }

        if (itlBooking.childs && itlBooking.childs.length > 0) {
            const filteredBooking: Booking = {
                adults: itlBooking.adults,
                childs: itlBooking.childs
            };
            const passengerResponse = await addPassengers(filteredBooking);
            if (passengerResponse) {
                const { data, headers } = passengerResponse;

				const result = processAndAddPaxes(itlBooking, data, "childs");
				allOkInBookingProcess = allOkInBookingProcess && result.allOkInBookingProcess;
			}
		}

		return { itlBooking, allOkInBookingProcess };// devuelves la nueva pero que solo se habrá puesto si vienen niños
	} catch (error) {
		throw error;
	}
};
