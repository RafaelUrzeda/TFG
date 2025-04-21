import { Billete, InsertIntoVUELOS_BILLETE_TARIFA } from '../interfaces/interface.index';

export const mapToVuelosTarifaDB = (datosBillete: Billete): InsertIntoVUELOS_BILLETE_TARIFA => {

    const { infoTarifa } = datosBillete;
    const { fopDetails } = infoTarifa || { fopDetails: [] };
    const fop1 = fopDetails[0];
    const fop2 = fopDetails[1];
    const fop3 = fopDetails[2];

    // Función para convertir cadenas a números, manejando comas y puntos
    const parseDecimal = (value: string | undefined): number => {
        if (value === undefined) {
            return 0;
        }
        return parseFloat(value.replace(',', '.')) || 0;
    };
    

    // Función para convertir una fecha DDMMYY a formato YYYY-MM-DD
    const formatDate = (date: string): string => {
        if (date && date.length === 6) {
            const day = date.slice(0, 2);
            const month = date.slice(2, 4);
            const year = '20' + date.slice(4, 6);  // Suponiendo que el año es del siglo 21
            return `${year}-${month}-${day}`;
        }
        return date; // Si la fecha no tiene el formato esperado, la dejamos igual
    };

    return {
        idpet: infoTarifa?.idpet ?? '',
        divisa_ori: infoTarifa?.divisa_ori ?? '',
        fec_emi: formatDate(infoTarifa?.fec_emi ?? ''), // Convertir la fecha a formato correcto
        iata: infoTarifa?.iata ?? '',
        fare_calc: infoTarifa?.fare_calc[0] ?? '',
        fop_ref3: fop3?.fopRef || '',
        fop_imp3: parseDecimal(fop3?.fopAmount) || 0,
        fop_type3: fop3?.fopType || '',
        fop_ref2: fop2?.fopRef || '',
        fop_imp2: parseDecimal(fop2?.fopAmount) || 0,
        fop_type2: fop2?.fopType || '',
        fop_ref1: fop1?.fopRef || '',
        fop_imp1: parseDecimal(fop1?.fopAmount) || 0,
        fop_type1: fop1?.fopType || '',
        total_coddiv: infoTarifa?.total_coddiv ?? '',
        total_tarif_coment: infoTarifa?.total_tarif_coment ?? '',
        total_tarif: parseDecimal(infoTarifa?.total_tarif) || 0,
        base_coddiv: infoTarifa?.base_coddiv ?? '',
        base_tarif: parseDecimal(infoTarifa?.base_tarif) || 0,
        locata_inv: infoTarifa?.locata_inv ?? '',
        locata_gds: infoTarifa?.locata_gds ?? '',
        numbil: infoTarifa?.numbil ?? '',
        seqserp: infoTarifa?.seqserp ?? '',
        seqserv: infoTarifa?.seqserv ?? '',
        idsol: infoTarifa?.idsol ?? '',
    };
};
