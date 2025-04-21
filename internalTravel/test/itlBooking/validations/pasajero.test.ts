import { constants as httpcodes } from "http2";
import { paxNotFound } from '../../../src/common/errors/passengerNotFoundError';
import { PaxesDB } from '../../../src/interfaces/interface.index';
import { notFoundPax } from '../../../src/validations/pasajeros.validation';


// Mock de la excepción paxNotFound
jest.mock('../../../src/common/errors/passengerNotFoundError');

describe('notFoundPax', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
    });

    it('should throw paxNotFound when datos is an empty array', () => {
        const datos: [] = [];

        expect(() => notFoundPax(datos)).toThrow(paxNotFound);
        expect(paxNotFound).toHaveBeenCalledWith(
            'Validar los Pasajeros',
            httpcodes.HTTP_STATUS_NOT_FOUND,
            'No se han encontrado pasajeros en la solicitud.'
        );
    });

    it('should not throw an error when datos contains elements', () => {
        const datos: PaxesDB[] = [{
            IDRESRVA: 0, SEQPAX: "1", NPAX: 1, NOMBRE: 'John', APELLIDO1: 'Doe', APELLIDO2: 'Smith', TIPOPASAJERO: 'A', DATNAC: '',
            TRATAMIENTO: '',
            PAXASOC: 0,
            NOMBREAMADEUS: '',
            NPAXAMADEUS: 0,
            SOCIEDAD: '',
            TOURCODE: '',
            STAFF: '',
            EMAIL: '',
            TELEFONO: '',
            NACDOCIDE: '',
            NACION: '',
            NUMEROPASAPORTE: '',
            FECHACADUCIDADPAS: '',
            POBLACION: '',
            TIPODOCRESIDENTE: '',
            DOCUMENTO: '',
            FORMAPAGO: '',
            CANDIDATORESIDENTE: ''
        }];

        expect(() => notFoundPax(datos)).not.toThrow();
        expect(paxNotFound).not.toHaveBeenCalled();
    });
});
