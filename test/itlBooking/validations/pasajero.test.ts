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
            idreserva: 0,
            seqpax: "1",
            npax: 1,
            nombre: 'John',
            apellido1: 'Doe',
            apellido2: 'Smith',
            tipopasajero: 'A',
            datnac: '',
            tratamiento: '',
            paxasoc: 0,
            nombreamadeus: '',
            npaxamadeus: 0,
            sociedad: '',
            tourcode: '',
            staff: '',
            email: '',
            telefono: '',
            nacdocide: '',
            nacion: '',
            numeropasaporte: '',
            fechacaducidadpas: '',
            poblacion: '',
            tipodocresidente: '',
            documento: '',
            formapago: '',
            candidatoresidente: ''
        }];

        expect(() => notFoundPax(datos)).not.toThrow();
        expect(paxNotFound).not.toHaveBeenCalled();
    });
});
