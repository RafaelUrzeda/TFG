import { constants as httpcodes } from "http2";
import { seatMapError } from '../../../src/common/errors/seatMapError';
import { seatMapValidation } from '../../../src/validations/seatMap.validations';


// Mock de la excepción seatMapError
jest.mock('../../../src/common/errors/seatMapError');

describe('seatMapValidation', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
    });

    it('should throw seatMapError when datos is "Seat map error"', () => {
        const datos = 'Seat map error';

        expect(() => seatMapValidation(datos)).toThrow(seatMapError);
        expect(seatMapError).toHaveBeenCalledWith(
            'Seat Map Error',
            httpcodes.HTTP_STATUS_NOT_FOUND,
            'Error al recuperar mapa de los asientos'
        );
    });

    it('should not throw an error for other values', () => {
        const validData = 'Valid data';
        const invalidData = {};

        expect(() => seatMapValidation(validData)).not.toThrow();
        expect(() => seatMapValidation(invalidData)).not.toThrow();
        expect(seatMapError).not.toHaveBeenCalled();
    });
});
