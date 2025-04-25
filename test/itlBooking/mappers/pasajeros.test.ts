import { Booking, PaxesDB } from '../../../src/interfaces/interface.index';
import { mapPaxes } from '../../../src/mappers//pasajeros.mapper';

describe('mapPaxes', () => {

    it('should map a list of adults and children correctly', () => {
        const itlBooking: Booking = {
        }
        const pasajeros: PaxesDB[] = [
            {
                idreserva: 0, seqpax: "1", npax: 1, nombre: 'John', apellido1: 'Doe', apellido2: 'Smith', tipopasajero: 'A', datnac: '',
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
            },
            {
                idreserva: 0, seqpax: "2", npax: 1, nombre: 'Jane', apellido1: 'Doe', apellido2: 'Smith', tipopasajero: 'C', datnac: '2012-05-10',
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
                seqpax: '1', tipopasajero: 'A', nombre: 'John', apellido1: 'Doe', apellido2: 'Smith',
                datnac: '1980-01-01',
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
                candidatoresidente: '',
                idreserva: 0,
                npax: 0
            },
            {
                seqpax: '2', tipopasajero: 'I', nombre: 'Baby', apellido1: 'Doe', apellido2: 'Smith', datnac: '2022-12-31', paxasoc: 1,
                idreserva: 0,
                npax: 0,
                tratamiento: '',
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
                seqpax: '1', tipopasajero: 'A', nombre: 'John', apellido1: 'Doe', apellido2: 'Smith',
                datnac: '1980-01-01',
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
                candidatoresidente: '',
                idreserva: 0,
                npax: 0
            },
            {
                seqpax: '2', tipopasajero: 'I', nombre: 'Baby', apellido1: 'Doe', apellido2: 'Smith', datnac: '2022-12-31', paxasoc: 0,
                idreserva: 0,
                npax: 0,
                tratamiento: '',
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
