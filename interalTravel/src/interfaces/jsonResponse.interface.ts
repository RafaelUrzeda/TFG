
export interface ContactInformationTf {
    paxReference?: ReferencePair[];
    telephone: string | undefined;
}

export interface Warnings {
    servicio?: string;
    errorCode?: string;
    errorMessage?: string;
    errorTxt?: string;
}

export interface Errors {
    servicio?: string;
    errorCode?: string;
    errorMessage?: string;
    errorTxt?: string;
}

export interface ContactInformationMail {
    paxReference?: ReferencePair[];
    email: string | undefined;
}

export interface SSR {
    type: string;
    freeText: string;
    flightsReference?: ReferencePair[]; 
    paxReference?: ReferencePair[];
    companyId?: string;
    status?: {
        type: string;
        quantity?: number
    }
}

export interface Remark {
    type: string;
    freeText: string;
    companyId?: string;
}

export interface ReferencePair {
    id: string | number;
}

export interface InfantInformation {
    nombreAmadeus?: string;
    firstName: string;
    surname: string;
    dateOfBirth: string;
}
export interface Adult {
    nombreAmadeus?: string;
    id: string;
    amadeusId?: string | null;
    firstName: string;
    surname: string;
    hasInfants: boolean;
    amaError?: object;
    infantInformation?: InfantInformation;
}

export interface Child {
    nombreAmadeus?: string;
    id: string;
    firstName: string;
    surname: string;
    dateOfBirth: string;
    amaError?: string;
    amadeusId?: string | null;
}

export interface codigosBloqueo {
    codigoBloqueo: string;
}

export interface Flight {
    idReserva?: string;
    id: string;
    seqser: number;
    amadeusId?: string;
    airportCodeOrigin: string;
    airportCodeDestination: string;
    departureDate: string;
    flightNumber: string;
    cabinClass: string;
    companyId: string;
    statusCode: string;
    ticketsNumber: number;
    llamadaGyms: string;
    codigoBloqueo: codigosBloqueo [];
    reservarAsientos: string;
    fullArrivalDate?: string;
    fullDepartureDate?: string;
    amadeusStatusCode?: string;
    amadeusErrorCode?: AmadeusErrorCode[];
    gymsResponse?: {
        gyms: any;
    } | object;
}

export interface AmadeusErrorCode {
    amadeusErrorCode: string;
    statusCode: string;
}

export interface Rm {
    type: string;
    freeText: string;
}

export interface FormOfPayment {
    reference: string;
    amount?: number | undefined;
    currency?: string | undefined;
    paxReference?: ReferencePair[];
}

export interface ResidentDiscount {
    discountType: string; 

    documentType: string;

    documentNumber: number;

    prefixLetter?: string; 

    suffixLetter?: string;

    fzLine: string;

    zipCode: string | null; 

    paxReference: ReferencePair;
}

export interface Booking {
    isSeatMapRequest?: boolean;

    idReserva?: string;

    idSolicitud?: string;

    adults?: Adult[];

    childs?: Child[];

    fops?: FormOfPayment[];

    flights?: Flight[];

    residentDiscounts?: ResidentDiscount[];

    fareTourCode?: {
        freeText: string;
        paxReference: ReferencePair[];
    }[];

    contactInformation?: (ContactInformationTf | ContactInformationMail)[];
    ssrContactInformation?: (ContactInformationTf | ContactInformationMail)[];

    ssrs?: SSR[];

    remarks?: Remark[];

    customSeats?:
    {
        paxReference?: ReferencePair[],
        flightReference?: ReferencePair[]
        seatNumber?: string;
        error?: string;
    }[]

    osiRemarks?: Remark[];

    skRemarks?: SSR[];

    fareEndorsementRemarks?: string[];

    arnk?:{amount: number}

    tkok?: boolean;

    rf?: string;
    
    endTransaction?: boolean;

    ignorePNR?: boolean;

    PNR?: any;

    localizador?: string;

    amadeussession?: string;

    warnings?: Warnings[];

    errors?: Errors[];
}

