import { Fila } from '../models/fila.model';

const nuevaFila = (numero: number): Fila => {
    return {
        fila: numero,
        asientosDisponibles: 0,
        asientos: [],
        pasillos: 0,
        gruposLibres: []
    };
}

const nuevoAsiento = () => {	
    return {
        columna: '',
        esAsiento: false,
        disponible: false,
        extras: []
    };
}

export { nuevaFila, nuevoAsiento };
