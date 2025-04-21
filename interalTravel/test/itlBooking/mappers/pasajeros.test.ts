import { Booking, PaxesDB } from '../../../src/interfaces/interface.index';
import { mapPaxes } from '../../../src/mappers//pasajeros.mapper';

describe('mapPaxes', () => {

    it('should map a list of adults and children correctly', () => {
        const itlBooking: Booking = {
        }
        const pasajeros: PaxesDB[] = [
            {
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
            },
            {
                IDRESRVA: 0, SEQPAX: "2", NPAX: 1, NOMBRE: 'Jane', APELLIDO1: 'Doe', APELLIDO2: 'Smith', TIPOPASAJERO: 'C', DATNAC: '2012-05-10',
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
            }
        ];


        const result = mapPaxes(pasajeros, itlBooking);

        expect(itlBooking.adults).toHaveLength(1);
        expect(itlBooking.childs).toHaveLength(1);

        // Verifica que el adulto tiene los datos correctos
        expect(result.adults?.[0]).toEqual({
            id: '1',
            nombreAmadeus: "",
            firstName: 'John ',
            surname: 'Doe Smith',
            hasInfants: false,
            infantInformation: undefined
        });

        // Verifica que el niño tiene los datos correctos
        expect(result.childs?.[0]).toEqual({
            id: '1',
            nombreAmadeus: "",
            firstName: 'Jane ',
            surname: 'Doe Smith',
            dateOfBirth: '10-05-2012'
        });
    });

    it('should map an infant to the corresponding adult', () => {
        const itlBooking: Booking = {
        }
        const pasajeros: PaxesDB[] = [
            {
                SEQPAX: '1', TIPOPASAJERO: 'A', NOMBRE: 'John', APELLIDO1: 'Doe', APELLIDO2: 'Smith',
                DATNAC: '1980-01-01',
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
                CANDIDATORESIDENTE: '',
                IDRESRVA: 0,
                NPAX: 0
            },
            {
                SEQPAX: '2', TIPOPASAJERO: 'I', NOMBRE: 'Baby', APELLIDO1: 'Doe', APELLIDO2: 'Smith', DATNAC: '2022-12-31', PAXASOC: 1,
                IDRESRVA: 0,
                NPAX: 0,
                TRATAMIENTO: '',
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
            }
        ];



        const result = mapPaxes(pasajeros, itlBooking);

        expect(result.adults).toHaveLength(1);
        expect(result.adults?.[0].hasInfants).toBe(false);
    });

	it('infants properly mapped to adults', () => {
        const itlBooking: Booking = {
        }
        const pasajeros: PaxesDB[] = [
            {
                SEQPAX: '1', TIPOPASAJERO: 'A', NOMBRE: 'John', APELLIDO1: 'Doe', APELLIDO2: 'Smith',
                DATNAC: '1980-01-01',
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
                CANDIDATORESIDENTE: '',
                IDRESRVA: 0,
                NPAX: 0
            },
            {
                SEQPAX: '2', TIPOPASAJERO: 'I', NOMBRE: 'Baby', APELLIDO1: 'Doe', APELLIDO2: 'Smith', DATNAC: '2022-12-31', PAXASOC: 0,
                IDRESRVA: 0,
                NPAX: 0,
                TRATAMIENTO: '',
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
            }
        ];



        const result = mapPaxes(pasajeros, itlBooking);

        expect(itlBooking.adults).toHaveLength(1);
		expect(itlBooking.adults?.[0].infantInformation?.dateOfBirth).toEqual('31-12-2022');
    });

    it('should return an empty object if no passengers are provided', () => {
        const pasajeros: PaxesDB[] = [];

        const itlBooking: Booking = {
        }

        const result = mapPaxes(pasajeros, itlBooking);

        expect(itlBooking).toEqual({});
    });
});
