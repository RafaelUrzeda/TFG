import { constants as httpcodes } from "http2";
import { elementsNotFoundError } from '../../../src/common/errors/elementsNotFoundError';
import { ElementsDB } from '../../../src/interfaces/elementosDb.interface';
import { notFoundElement } from '../../../src/validations/elementos.validations';

// Mock de la excepción solicitudNotFound
jest.mock('../../../src/common/errors/elementsNotFoundError');

describe('notFoundElmenent', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
    });

    it('should throw solicitudNotFound when datos is an empty array', () => {
        const datos: [] = [];

        expect(() => notFoundElement(datos)).toThrow(elementsNotFoundError);
        expect(elementsNotFoundError).toHaveBeenCalledWith(
            'Validar los Vuelos',
            httpcodes.HTTP_STATUS_NOT_FOUND,
            'No se han encontrado datos en la solicitud.'
        );
    });

    it('should not throw an error when datos contains elements', () => {
        const datos: ElementsDB[] | [] = [{
            tipoelemento: 'CTCE',
            codssr: 'CTCE',
            txtssr: 'email@example.com',
            numleg: '1',
            numpax: '2',
            ciassr: 'AA',
            accssr: 'HK',
            idresrva: 0,
            numpaxamadeus: 0,
            comandoamadeus: ''
        }];

        expect(() => notFoundElement(datos)).not.toThrow();
        expect(elementsNotFoundError).not.toHaveBeenCalled();
    });
});
