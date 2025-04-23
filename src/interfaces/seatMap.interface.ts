interface SeatDetail {
    seatColumn: string;
}

interface CompartmentDetail {
    code: string;
    numberRows: number;
    details: SeatDetail[];
}

interface Seat {
    column: string;
    available: boolean;
    seatType: 'SEAT' | 'GAP'; 
    features: string[];
}

interface Row {
    number: number;
    compartment: string;
    seats: Seat[];
}

interface Compartment {
    cabinType: 'BUSINESS' | 'ECONOMY'; 
    compartments: CompartmentDetail[];
    rows: Row[];
}

interface AircraftType {
    model: string;
}

interface SeatMap {
    aircraftType: AircraftType;
    cabins: Compartment[];
}

export { AircraftType, Compartment, CompartmentDetail, Row, Seat, SeatDetail, SeatMap };
