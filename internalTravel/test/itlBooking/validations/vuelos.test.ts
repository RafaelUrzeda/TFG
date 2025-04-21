import { constants as httpcodes } from "http2";
import { flightNotFoundError } from '../../../src/common/errors/flightNotFoundError';
import { notFoundFlight, validationInputs } from '../../../src/validations/vuelos.validations';


// Mock de la excepción FlightNotFoundError
jest.mock('../../../src/common/errors/flightNotFoundError');

describe('foundFlight', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
    });

    it('should throw FlightNotFoundError when datos is an empty array', () => {
        const datos: [] = [];

        expect(() => notFoundFlight(datos)).toThrow(flightNotFoundError);
        expect(flightNotFoundError).toHaveBeenCalledWith(
            'Validar los Vuelos',
            httpcodes.HTTP_STATUS_NOT_FOUND,
            'Vuelo no encontrado'
        );
    });
});

describe('validationInputs', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
    });

    it('should throw FlightNotFoundError when idReserva is not provided', () => {
        const idReserva = 0; // Puedes usar 0, null o undefined para probar la ausencia de datos

        expect(() => validationInputs(idReserva)).toThrow(flightNotFoundError);
        expect(flightNotFoundError).toHaveBeenCalledWith(
            'Sin id Reserva',
            httpcodes.HTTP_STATUS_BAD_REQUEST,
            'Faltan datos, BadRequest.'
        );
    });

    it('should not throw an error when idReserva is provided', () => {
        const idReserva = 123;

        expect(() => validationInputs(idReserva)).not.toThrow();
        expect(flightNotFoundError).not.toHaveBeenCalled();
    });
});
