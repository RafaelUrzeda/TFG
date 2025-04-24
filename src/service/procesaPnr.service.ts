import { cancelPNR } from "../externals/adeleteAmadeus.external";
import { cancelElements, deletePnrElements, PaxesDB } from "../interfaces/interface.index";

export const deleteElements = async (pnrData: any, amadeusSession: string, token: string) => {

    // Condiciones para eliminar elementos
    const conditions = [
        { command: 'FD' },
        { command: 'FZ' },
        { command: 'DOCS' },
        { command: 'CTCE' },
        { command: 'APE' },
        { command: 'CTCM' },
        { command: 'CKIN' },
        { command: 'AP'},
        { command: 'FP'}
    ];

    const filteredElements = pnrData.dataElementsMaster.dataElementsIndiv.filter((element: any) => {
        const { segmentName } = element.elementManagementData;
        const serviceRequest = element.serviceRequest ? element.serviceRequest.ssr : null;

        return conditions.some(condition => {
            if (segmentName === 'SSR' && serviceRequest) {
                return condition.command === serviceRequest.type;
            }
            return segmentName === condition.command;
        });
    });

    const cancelElements: cancelElements[] = filteredElements.map((element: any) => {
        const { qualifier, number } = element.elementManagementData.reference;
        return {
            identifier: qualifier,
            number: number
        };
    });

    const result: deletePnrElements = {
        actionCode: 11,
        cancelType: "E",
        cancelElements: cancelElements
    };
    if (cancelElements.length > 0) {
        const response =  await cancelPNR(result, amadeusSession, token);
        return response;
    }
};

export const deletePassengers = async (
    pnrData: any,
    amadeusSession: string,
    token: string,
    pasajeros: PaxesDB[]
) => {
    const existingPassengersSet = new Set(
        pasajeros.map(
            (p) =>
                `${p.nombre.trim().toUpperCase()} ${p.apellido1.trim().toUpperCase()} ${p.apellido2?.trim().toUpperCase() || ""}`.trim()
        )
    );


    // Filtrar pasajeros del PNR que no están en la lista de `pasajeros`
    const filteredPassengers = pnrData.travellerInfo.filter((traveller: any) => {
        const { surname } = traveller.passengerData[0].travellerInformation.traveller;
        const firstName = traveller.passengerData[0].travellerInformation.passenger[0].firstName;

        // Crear el nombre completo del pasajero en el PNR
        const fullName = `${firstName.trim().toUpperCase()} ${surname.trim().toUpperCase()}`;

        // Verificar si no está en la lista de pasajeros de la base de datos
        return !existingPassengersSet.has(fullName);
    });


    // Mapear pasajeros a formato requerido para cancelación
    const cancelPassengersList: cancelElements[] = filteredPassengers.map((traveller: any) => {
        const { qualifier, number } = traveller.elementManagementPassenger.reference;
        return {
            identifier: qualifier,
            number: number
        };
    });

    // Crear el objeto resultante
    const result: deletePnrElements = {
        actionCode: 0,
        cancelType: "E",
        cancelElements: cancelPassengersList
    };


    // Llamar a la función de cancelación
    if (cancelPassengersList.length > 0) {
        await cancelPNR(result, amadeusSession, token);
    }
};
