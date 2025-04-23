import { Adult, Booking, Child, InfantInformation, PaxesDB } from '../interfaces/interface.index';

//Variables generales
const PAX_TYPES = {
    ADULT: 'A',
    CHILD: 'C',
    INFANT: 'I'
}
// spanish characters: ñ á é í ó ú ü, etc
const DELETE_STRANGE_CHARACTERS = /[\u0300-\u036f]/g;
const DELETE_NUMBERS_AND_SPACES = /[^\w\s]|[\d]/gi;
const DELETE_UNNECESSARY_SPACES = /\s+/g;

export const mapPaxes = (pasajeros: PaxesDB[], itlBooking: Booking) => {

    const adults: Adult[] = [];
    const children: Child[] = [];

    const adultMap: Record<number, Adult> = {};

    pasajeros.forEach(pax => {
        const seqPax = Number(pax.NPAX);

        switch (pax.TIPOPASAJERO) {

            case PAX_TYPES.ADULT: {
                const adult = mapAdult(pax);
                adults.push(adult);
                adultMap[seqPax] = adult;
                break;
            }

            case PAX_TYPES.CHILD:
                children.push(mapChild(pax));
                break;

            case PAX_TYPES.INFANT: {
                const associatedAdult = adultMap[Number(pax.PAXASOC)];
                if (associatedAdult) {
                    associatedAdult.hasInfants = true;

                    // Llamamos a la función `adaptarNombrePasajeroConInf` con datos combinados del adulto e infante
                    const adaptedNames = adaptarNombrePasajeroConInf(
                        associatedAdult.firstName,
                        associatedAdult.surname.split(' ')[0] || '', // Primer apellido del adulto
                        associatedAdult.surname.split(' ')[1] || '', // Segundo apellido del adulto
                        pax.NOMBRE,
                        pax.APELLIDO1,
                        pax.APELLIDO2 || ''
                    );

                    // Actualizamos nombres y apellidos del adulto con los adaptados
                    associatedAdult.firstName = adaptedNames.nombrePasajero;
                    associatedAdult.surname = `${adaptedNames.primerApellidoPasajero} ${adaptedNames.segundoApellidoPasajero}`.trim();

                    // Actualizamos los datos del infante
                    associatedAdult.infantInformation = {
                        ...mapInfant(pax),
                        firstName: adaptedNames.nombreBebe,
                        surname: `${adaptedNames.primerApellidoBebe} ${adaptedNames.segundoApellidoBebe}`.trim()
                    };
                }
                break;
            }
            default: {
                const adult = mapAdult(pax);
                adults.push(adult);
                adultMap[seqPax] = adult;
                break;
            }
        }
    });

    if (adults.length > 0) itlBooking.adults = adults;
    if (children.length > 0) itlBooking.childs = children;

    return itlBooking;
};

const mapCommonFields = (data: PaxesDB) => ({
    nombreAmadeus: data.NOMBREAMADEUS,
    id: data.NPAX?.toString(),
    firstName: normalizeCharacters(`${data.NOMBRE} ${data.TRATAMIENTO}`),
    surname: normalizeCharacters(`${data.APELLIDO1} ${data.APELLIDO2 || ''}`.trim()),
});

const mapAdult = (data: PaxesDB): Adult => ({
    ...mapCommonFields(data),
    hasInfants: false,
    infantInformation: undefined
});

const mapChild = (data: PaxesDB): Child => ({
    ...mapCommonFields(data),
    dateOfBirth: data.DATNAC ? reverseDate(data.DATNAC) : ''
});

const mapInfant = (data: PaxesDB): InfantInformation => ({
    ...mapCommonFields(data),
    dateOfBirth: data.DATNAC ? reverseDate(data.DATNAC) : ''
});


const reverseDate = (date: string): string => {
    return (new Date(date).toISOString().split('T')[0]).split('-').reverse().join('-');
}

const normalizeCharacters = (name: string): string => {
    return name.normalize('NFD').replace(DELETE_STRANGE_CHARACTERS, "").replace(DELETE_NUMBERS_AND_SPACES, '').replace(DELETE_UNNECESSARY_SPACES, ' ');;
}

const adaptarNombrePasajeroConInf = (
    nombrePasajero: string,
    primerApellidoPasajero: string,
    segundoApellidoPasajero: string,
    nombreBebe: string,
    primerApellidoBebe: string,
    segundoApellidoBebe: string
): {
    nombrePasajero: string,
    primerApellidoPasajero: string,
    segundoApellidoPasajero: string,
    nombreBebe: string,
    primerApellidoBebe: string,
    segundoApellidoBebe: string
} => {
    const longitudMaxima = 35;

    // Helper para calcular la longitud total
    const calcularLongitudTotal = () =>
        nombrePasajero.length +
        primerApellidoPasajero.length +
        segundoApellidoPasajero.length +
        nombreBebe.length +
        primerApellidoBebe.length +
        segundoApellidoBebe.length;

    // Helper para recortar strings
    const recortarString = (str: string, maxLength: number) => str.substring(0, maxLength);

    // Inicialización de variables
    let longitudTotal = calcularLongitudTotal();

    // Recorte del segundo apellido del bebé
    if (segundoApellidoBebe) {
        while (longitudTotal > longitudMaxima && segundoApellidoBebe.length > 0) {
            segundoApellidoBebe = recortarString(segundoApellidoBebe, segundoApellidoBebe.length - 1);
            longitudTotal = calcularLongitudTotal();
        }
    }

    // Recorte del segundo apellido del pasajero 
    if (segundoApellidoPasajero) {
        while (longitudTotal > longitudMaxima && segundoApellidoPasajero.length > 0) {
            segundoApellidoPasajero = recortarString(segundoApellidoPasajero, segundoApellidoPasajero.length - 1);
            longitudTotal = calcularLongitudTotal();
        }
    }

    // Recorte del nombre del bebé
    if (longitudTotal > longitudMaxima) {
        nombreBebe = recortarString(nombreBebe, 1);
        longitudTotal = calcularLongitudTotal();
    }

    // Recorte del nombre del pasajero
    if (longitudTotal > longitudMaxima) {
        nombrePasajero = recortarString(nombrePasajero, 1);
        longitudTotal = calcularLongitudTotal();
    }

    // Recorte del primer apellido del pasajero
    while (longitudTotal > longitudMaxima && primerApellidoPasajero.length > 0) {
        primerApellidoPasajero = recortarString(primerApellidoPasajero, primerApellidoPasajero.length - 1);
        longitudTotal = calcularLongitudTotal();
    }

    return {
        nombrePasajero,
        primerApellidoPasajero,
        segundoApellidoPasajero,
        nombreBebe,
        primerApellidoBebe,
        segundoApellidoBebe
    };
}
