"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePassengers = exports.deleteElements = void 0;
const adeleteAmadeus_external_1 = require("../externals/adeleteAmadeus.external");
const deleteElements = async (pnrData, amadeusSession, token) => {
    // Condiciones para eliminar elementos
    const conditions = [
        { command: 'FD' },
        { command: 'FZ' },
        { command: 'DOCS' },
        { command: 'CTCE' },
        { command: 'APE' },
        { command: 'CTCM' },
        { command: 'CKIN' },
        { command: 'AP' },
        { command: 'FP' }
    ];
    const filteredElements = pnrData.dataElementsMaster.dataElementsIndiv.filter((element) => {
        const { segmentName } = element.elementManagementData;
        const serviceRequest = element.serviceRequest ? element.serviceRequest.ssr : null;
        return conditions.some(condition => {
            if (segmentName === 'SSR' && serviceRequest) {
                return condition.command === serviceRequest.type;
            }
            return segmentName === condition.command;
        });
    });
    const cancelElements = filteredElements.map((element) => {
        const { qualifier, number } = element.elementManagementData.reference;
        return {
            identifier: qualifier,
            number: number
        };
    });
    const result = {
        actionCode: 11,
        cancelType: "E",
        cancelElements: cancelElements
    };
    if (cancelElements.length > 0) {
        const response = await (0, adeleteAmadeus_external_1.cancelPNR)(result, amadeusSession, token);
        return response;
    }
};
exports.deleteElements = deleteElements;
const deletePassengers = async (pnrData, amadeusSession, token, pasajeros) => {
    const existingPassengersSet = new Set(pasajeros.map((p) => `${p.NOMBRE.trim().toUpperCase()} ${p.APELLIDO1.trim().toUpperCase()} ${p.APELLIDO2?.trim().toUpperCase() || ""}`.trim()));
    // Filtrar pasajeros del PNR que no están en la lista de `pasajeros`
    const filteredPassengers = pnrData.travellerInfo.filter((traveller) => {
        const { surname } = traveller.passengerData[0].travellerInformation.traveller;
        const firstName = traveller.passengerData[0].travellerInformation.passenger[0].firstName;
        // Crear el nombre completo del pasajero en el PNR
        const fullName = `${firstName.trim().toUpperCase()} ${surname.trim().toUpperCase()}`;
        // Verificar si no está en la lista de pasajeros de la base de datos
        return !existingPassengersSet.has(fullName);
    });
    // Mapear pasajeros a formato requerido para cancelación
    const cancelPassengersList = filteredPassengers.map((traveller) => {
        const { qualifier, number } = traveller.elementManagementPassenger.reference;
        return {
            identifier: qualifier,
            number: number
        };
    });
    // Crear el objeto resultante
    const result = {
        actionCode: 0,
        cancelType: "E",
        cancelElements: cancelPassengersList
    };
    // Llamar a la función de cancelación
    if (cancelPassengersList.length > 0) {
        await (0, adeleteAmadeus_external_1.cancelPNR)(result, amadeusSession, token);
    }
};
exports.deletePassengers = deletePassengers;
