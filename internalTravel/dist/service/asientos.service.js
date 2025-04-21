"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asignaPlazas = exports.asignaPlazasVPaco = exports.buscaAsiento = void 0;
const http2_1 = require("http2");
const seatMapError_1 = require("../common/errors/seatMapError");
const seatMap_external_1 = require("../externals/seatMap.external");
const asientos_mapper_1 = require("../mappers/asientos.mapper");
const buscaAsiento = async (ITLBooking, asignaAsientos) => {
    let mapaAsientos;
    if (ITLBooking !== undefined) {
        const totalPasajeros = ITLBooking.flights && ITLBooking.flights.length > 0 ? ITLBooking.flights[0].ticketsNumber : 0;
        ITLBooking.customSeats = [];
        try {
            for (const vuelo of ITLBooking.flights || []) {
                let pasajeroIndex = 0;
                if (vuelo.reservarAsientos === 'S') {
                    try {
                        mapaAsientos = await (0, seatMap_external_1.getSeatMap)(vuelo);
                    }
                    catch (error) {
                        const err = error;
                        ITLBooking.warnings = ITLBooking.warnings || [];
                        ITLBooking.warnings.push({
                            servicio: 'Seat Map',
                            errorCode: (err.response?.data?.statusCode?.toString() || '0'),
                            errorMessage: err.response?.data?.message,
                            errorTxt: `Error al obtener SeatMap para el vuelo ${vuelo.flightNumber}`,
                        });
                    }
                }
                if (mapaAsientos) {
                    controlMapas.mapaDisponible = true;
                    controlMapas.vueloFilter = {
                        origin: vuelo.airportCodeOrigin,
                        destination: vuelo.airportCodeDestination,
                        vuelo: vuelo.flightNumber,
                        fecha: vuelo.departureDate,
                        entorno: 'ECONOMY'
                    };
                    await procesaEconomy(mapaAsientos);
                    await procesaBusiness(mapaAsientos);
                    const asientosVueloString = await (0, exports.asignaPlazasVPaco)(totalPasajeros);
                    const asientosVuelo = asientosVueloString.split(',').map(seat => seat.trim());
                    if (asientosVuelo.length > 0 && pasajeroIndex < totalPasajeros) {
                        for (let i = 0; i < asientosVuelo.length; i++) {
                            if (pasajeroIndex >= totalPasajeros)
                                break;
                            const pasajero = {
                                id: ITLBooking.adults?.[pasajeroIndex]?.id || ITLBooking.childs?.[pasajeroIndex]?.id || ''
                            };
                            ITLBooking.customSeats.push({
                                paxReference: [pasajero],
                                flightReference: [{ id: vuelo.id }],
                                seatNumber: asientosVuelo[i],
                            });
                            pasajeroIndex++;
                        }
                    }
                    controlMapas.reset();
                }
            }
        }
        catch (error) {
            console.error('Error al obtener el mapa de asientos:', error);
            throw new seatMapError_1.seatMapError('Seat Map Error', http2_1.constants.HTTP_STATUS_NOT_FOUND, 'Error al recuperar el mapa de los asientos');
        }
    }
    else if (asignaAsientos) {
        const totalPasajeros = asignaAsientos.selectSeatMapParams?.totalPassengers || 0;
        // eslint-disable-next-line 
        let response = {
            seatMap: {},
            customSeats: []
        };
        try {
            mapaAsientos = await (0, seatMap_external_1.getSeatMap)(undefined, asignaAsientos);
            if (mapaAsientos) {
                controlMapas.mapaDisponible = true;
                response.seatMap = mapaAsientos;
                controlMapas.vueloFilter = {
                    origin: asignaAsientos.departure,
                    destination: asignaAsientos.arrival,
                    vuelo: asignaAsientos.flightNumber,
                    fecha: asignaAsientos.departureDate,
                    entorno: asignaAsientos.selectSeatMapParams?.businessClass ? 'BUSINESS' : 'ECONOMY'
                };
                controlMapas.seatFilter = {
                    cabina: asignaAsientos.selectSeatMapParams?.businessClass ? 'BUSINESS' : 'ECONOMY',
                    pasajeros: totalPasajeros,
                    filaInicial: asignaAsientos.selectSeatMapParams?.initialRow || 0,
                    asienttoXL: asignaAsientos.selectSeatMapParams?.XLSeat || false,
                    asientoSalida: asignaAsientos.selectSeatMapParams?.emergency || false
                };
                await procesaEconomy(mapaAsientos);
                await procesaBusiness(mapaAsientos);
                const pureba = await (0, exports.asignaPlazasVPaco)(totalPasajeros);
                response.customSeats = (await (0, exports.asignaPlazasVPaco)(totalPasajeros)).split(',').map(seat => ({ seatNumber: seat.trim() }));
                controlMapas.reset();
            }
            return response;
        }
        catch (error) {
            console.error('Error al obtener el mapa de asientos:', error);
            throw new seatMapError_1.seatMapError('Seat Map Error', http2_1.constants.HTTP_STATUS_NOT_FOUND, 'Error al recuperar el mapa de los asientos');
        }
    }
};
exports.buscaAsiento = buscaAsiento;
// eslint-disable-next-line
let controlMapas = {
    mapaDisponible: false,
    cadenaBusiness: 'BUSINESS',
    cadenaEconomy: 'ECONOMY',
    cadenaAsiento: 'SEAT',
    cadenaPasillo: 'GAP',
    seatFilter: {
        cabina: 'ECONOMY',
        pasajeros: 0,
        filaInicial: 0,
        asienttoXL: false,
        asientoSalida: false
    },
    maxAsientosDisponible: 0,
    vueloFilter: {
        origen: '',
        destino: '',
        vuelo: '',
        fecha: '',
        entorno: ''
    },
    infoVuelo: {
        modeloAvion: '',
        //Business Control
        hayBusiness: false,
        asientosBusiness: 0,
        asientosBusinessLibres: 0,
        asientosBusinessAsignables: 0,
        mapaBusiness: [],
        mapaColsBusiness: [],
        mapaFilesBusiness: [],
        mapaPaintBusiness: [],
        //Economy Control
        hayEconomy: false,
        asientosEconomy: 0,
        asientosEconomyLibres: 0,
        asientosEconomyAsignables: 0,
        mapaEconomy: [],
        mapaColsEconomy: [],
        mapaFilesEconomy: [],
        mapaPaintEconomy: [],
        maxAsientosDisp: 0
    },
    reset: function () {
        controlMapas.mapaDisponible = false;
        controlMapas.infoVuelo = {
            modeloAvion: '',
            hayBusiness: false,
            asientosBusiness: 0,
            asientosBusinessLibres: 0,
            asientosBusinessAsignables: 0,
            mapaBusiness: [],
            mapaColsBusiness: [],
            mapaFilesBusiness: [],
            mapaPaintBusiness: [],
            hayEconomy: false,
            asientosEconomy: 0,
            asientosEconomyLibres: 0,
            asientosEconomyAsignables: 0,
            mapaEconomy: [],
            mapaColsEconomy: [],
            mapaFilesEconomy: [],
            mapaPaintEconomy: [],
            maxAsientosDisp: 0
        };
    },
};
const getPatrones = (totalPasajeros) => {
    const maxAsientos = controlMapas.infoVuelo.maxAsientosDisp;
    const patrones = [];
    const patronesBase = {
        9: [
            [4, 3, 2], [3, 3, 3], [3, 2, 2, 2], [4, 4, 1], [4, 2, 2, 1],
            [3, 3, 2, 1], [2, 2, 2, 2, 1], [4, 3, 1, 1], [3, 2, 2, 1, 1],
            [4, 2, 1, 1, 1], [3, 3, 1, 1, 1], [2, 2, 2, 1, 1, 1], [3, 2, 1, 1, 1, 1],
            [4, 1, 1, 1, 1, 1], [2, 2, 1, 1, 1, 1, 1], [3, 1, 1, 1, 1, 1, 1],
            [2, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        8: [
            [4, 4], [4, 2, 2], [3, 3, 2], [2, 2, 2, 2], [4, 3, 1], [2, 2, 2, 1, 1],
            [4, 2, 1, 1], [3, 3, 1, 1], [4, 1, 1, 1, 1], [2, 2, 1, 1, 1, 1],
            [3, 2, 1, 1, 1], [3, 1, 1, 1, 1, 1], [2, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1]
        ],
        7: [
            [4, 3], [3, 2, 2], [4, 2, 1], [3, 3, 1], [2, 2, 2, 1], [3, 2, 1, 1],
            [4, 1, 1, 1], [2, 2, 1, 1, 1], [3, 1, 1, 1, 1], [2, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1]
        ],
        6: [
            [4, 2], [3, 3], [2, 2, 2], [3, 2, 1], [4, 1, 1], [2, 2, 1, 1],
            [3, 1, 1, 1], [2, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1]
        ],
        5: [
            [4, 1], [3, 2], [2, 2, 1], [3, 1, 1], [2, 1, 1, 1], [1, 1, 1, 1, 1]
        ],
        4: [
            [4], [2, 2], [3, 1], [2, 1, 1], [1, 1, 1, 1]
        ],
        3: [
            [3], [2, 1], [1, 1, 1]
        ],
        2: [
            [2], [1, 1]
        ],
        1: [
            [1]
        ]
    };
    const filtrarPatrones = (patrones) => {
        return patrones.filter(patron => Math.max(...patron) <= maxAsientos);
    };
    if (patronesBase[totalPasajeros]) {
        patrones.push(...filtrarPatrones(patronesBase[totalPasajeros]));
    }
    return patrones;
};
const procesaCabina = (obj, tipoCabina, tipoCadena, hayCabinaKey) => {
    try {
        for (const cabin of obj.cabins) {
            if (cabin.cabinType === tipoCadena && cabin.rows.length > 0) {
                controlMapas.infoVuelo[hayCabinaKey] = true;
                mapeaAsientos(cabin.rows, tipoCadena);
            }
        }
    }
    catch (e) {
        console.error(`Error al procesar la cabina ${tipoCabina}:`, e);
    }
};
const procesaBusiness = (obj) => {
    procesaCabina(obj, "Business", controlMapas.cadenaBusiness, "hayBusiness");
};
const procesaEconomy = (obj) => {
    procesaCabina(obj, "Economy", controlMapas.cadenaEconomy, "hayEconomy");
};
const compruebaFila = (fila, clase) => {
    const mapa = clase === controlMapas.cadenaBusiness ? controlMapas.infoVuelo.mapaFilesBusiness : controlMapas.infoVuelo.mapaFilesEconomy;
    if (!mapa.includes(fila)) {
        mapa.push(fila);
    }
};
const compruebaColumna = (col, clase) => {
    const mapaCols = clase === controlMapas.cadenaBusiness ? controlMapas.infoVuelo.mapaColsBusiness : controlMapas.infoVuelo.mapaColsEconomy;
    const mapaPaint = clase === controlMapas.cadenaBusiness ? controlMapas.infoVuelo.mapaPaintBusiness : controlMapas.infoVuelo.mapaPaintEconomy;
    if (!mapaCols.includes(col)) {
        mapaCols.push(col);
        mapaPaint['c' + col] = [];
    }
};
// Crea un mapa para facilitar la asignacion de los asientos
const mapeaAsientos = (filas, cabina) => {
    let totalAsientos = 0;
    let totalAsientosLibres = 0;
    for (const fila of filas) {
        const filaObj = { ...(0, asientos_mapper_1.nuevaFila)(fila.number) };
        compruebaFila('' + filaObj.fila, cabina);
        for (const asiento of fila.seats) {
            if (asiento.seatType === controlMapas.cadenaPasillo) {
                filaObj.pasillos++;
            }
        }
        // Inicializamos la disponibilidad por bloque de asientos
        filaObj.gruposLibres = Array(filaObj.pasillos + 1).fill(0);
        let asientosDisponibles = 0;
        let pasillo = 0;
        for (const asiento of fila.seats) {
            const asientoObj = (0, asientos_mapper_1.nuevoAsiento)();
            asientoObj.columna = asiento.column;
            compruebaColumna(asientoObj.columna, cabina);
            asientoObj.esAsiento = (asiento.seatType === controlMapas.cadenaAsiento);
            asientoObj.disponible = asiento.available;
            asientoObj.extras = asiento.features;
            if (asientoObj.esAsiento) {
                totalAsientos++;
            }
            if (asientoObj.esAsiento && asientoObj.disponible) {
                totalAsientosLibres++;
                asientosDisponibles++;
                filaObj.gruposLibres[pasillo]++;
            }
            if (asiento.seatType === controlMapas.cadenaPasillo) {
                pasillo++;
            }
            filaObj.asientos.push(asientoObj);
            const columnaRef = 'c' + asientoObj.columna;
            const filaRef = 'f' + filaObj.fila;
            const mapaPaint = cabina === controlMapas.cadenaBusiness ? controlMapas.infoVuelo.mapaPaintBusiness : controlMapas.infoVuelo.mapaPaintEconomy;
            try {
                mapaPaint[columnaRef][filaRef] = { ...asientoObj };
            }
            catch (e) {
                mapaPaint[columnaRef] = [];
                mapaPaint[columnaRef][filaRef] = { ...asientoObj };
                console.error(`Error al mapear asiento ${cabina}:`, e);
            }
        }
        filaObj.asientosDisponibles = asientosDisponibles;
        if (cabina === controlMapas.cadenaBusiness) {
            controlMapas.infoVuelo.mapaBusiness.push({ ...filaObj });
        }
        else {
            controlMapas.infoVuelo.mapaEconomy.push({ ...filaObj });
            for (const gruposLibres of filaObj.gruposLibres) {
                if (gruposLibres > controlMapas.infoVuelo.maxAsientosDisp) {
                    controlMapas.infoVuelo.maxAsientosDisp = gruposLibres;
                }
            }
        }
        if (cabina === controlMapas.cadenaBusiness) {
            controlMapas.infoVuelo.asientosBusiness = totalAsientos;
            controlMapas.infoVuelo.asientosBusinessLibres = totalAsientosLibres;
        }
        else {
            controlMapas.infoVuelo.asientosEconomy = totalAsientos;
            controlMapas.infoVuelo.asientosEconomyLibres = totalAsientosLibres;
        }
    }
};
const asignaPlazasVPaco = (totalPasajeros) => {
    const patrones = getPatrones(totalPasajeros);
    const asientoXLPermitido = controlMapas.seatFilter.asienttoXL;
    const salidaPermitido = controlMapas.seatFilter.asientoSalida;
    const filainicio = controlMapas.seatFilter.filaInicial;
    let operacionCompleta = false;
    let segundaVuelta = false;
    let pasajerosPatron = 0;
    let asientosReservados = [];
    const datvlo = [...controlMapas.infoVuelo.mapaEconomy];
    let asientosstr = "";
    for (let p = 0; p < patrones.length; p++) {
        let patronesCompletos = 0;
        asientosReservados = [];
        const patron = patrones[p];
        for (let pp = 0; pp < patron.length; pp++) {
            pasajerosPatron = patron[pp];
            segundaVuelta = false;
            for (let f = 0 + filainicio; f < datvlo.length; f++) {
                let colocacionOK = false;
                let asientostmp = [];
                for (let gl = 0; gl < datvlo[f].gruposLibres.length; gl++) {
                    asientostmp = [];
                    // Comprobamos que cabe el grupo de pasajeros
                    if (datvlo[f].gruposLibres[gl] >= patron[pp]) {
                        // Comprobamos que los asientos son correctos
                        let contadorDeGaps = 0;
                        for (let a = 0; a < datvlo[f].asientos.length; a++) {
                            let candidato = false;
                            // Si estamos en un gap pasamos de grupo
                            if (!datvlo[f].asientos[a].esAsiento) {
                                contadorDeGaps++;
                            }
                            // Estamos en el grupo correcto?                                
                            if (contadorDeGaps === gl) {
                                // Será candidato si es un asiento, está disponible y cumple las condiciones
                                const detalles = `,${datvlo[f].asientos[a].extras.join(',')},`;
                                if (datvlo[f].asientos[a].esAsiento && datvlo[f].asientos[a].disponible) {
                                    candidato = !((!asientoXLPermitido && detalles.includes(",L,")) || (!salidaPermitido && detalles.includes(",E,")));
                                }
                                // Si es una plaza sola, intentamos que sea ventanilla o pasillo siempre que sea la primera vuelta
                                if (pasajerosPatron === 1 && !segundaVuelta) {
                                    candidato = candidato && (detalles.includes(",W,") || detalles.includes(",A,"));
                                }
                                //Si es candidato comprobamos que no lo tengamos ya para reservar
                                if (candidato) {
                                    //sentencia valida, pero hago la mia
                                    //candidato=!asientosReservados.some((res) => res.f === f && res.c === datvlo[f].asientos[a].columna && res.fila === datvlo[f].fila);
                                    for (let as = 0; as < asientosReservados.length; as++) {
                                        // Comprobamos que no esté ya reservado
                                        if (asientosReservados[as].f === f && asientosReservados[as].c === datvlo[f].asientos[a].columna && asientosReservados[as].fila === datvlo[f].fila) {
                                            candidato = false;
                                            break;
                                        }
                                    }
                                }
                                // Si todo está ok
                                if (candidato) {
                                    asientostmp.push({ f, c: datvlo[f].asientos[a].columna, fila: datvlo[f].fila });
                                    if (asientostmp.length === patron[pp]) {
                                        colocacionOK = true;
                                        patronesCompletos++;
                                        break;
                                    }
                                }
                                else {
                                    // Si no es candidato limpiamos los asientos que pudieramos tener
                                    asientostmp = [];
                                }
                            }
                        } //For asientos de Fila
                        if (colocacionOK) {
                            asientosReservados.push(...asientostmp);
                            asientostmp = [];
                            break;
                        }
                    }
                } // For Grupos
                //Si hemos colocado salimos
                if (colocacionOK) {
                    break;
                }
                // Si estamos buscando 1 solo pasajero,hemos llegado a la ultima fila y no se ha colocado reiniciamos el for para una segunda vuelta
                if (pasajerosPatron === 1 && !segundaVuelta && f === datvlo.length - 1) {
                    segundaVuelta = true;
                    f = -1;
                }
            } // For fila
        } // For lista Patron
        if (patronesCompletos === patron.length) {
            asientosstr = formatearAsientos(asientosReservados);
            operacionCompleta = true;
            break;
        }
    } // For patrones
    return asientosstr;
};
exports.asignaPlazasVPaco = asignaPlazasVPaco;
// a partir de aqui, version en funciones pequeñas
const asignaPlazas = (totalPasajeros) => {
    const Patrones = getPatrones(totalPasajeros);
    const filtroAsientos = controlMapas.seatFilter;
    const datvlo = [...controlMapas.infoVuelo.mapaEconomy];
    let response = "";
    for (const patron of Patrones) {
        const asientosReservados = procesarPatron(patron, datvlo, filtroAsientos);
        if (asientosReservados) {
            response = formatearAsientos(asientosReservados);
            break;
        }
    }
    return response; // Sin plazas disponibles
};
exports.asignaPlazas = asignaPlazas;
const procesarPatron = (patron, datvlo, filtroAsientos) => {
    const { asientoXL, asientoSalida, filaInicial } = filtroAsientos;
    let segundaVuelta = false;
    const asientosReservados = [];
    for (const pasajerosPatron of patron) {
        let filaAsignada = false;
        segundaVuelta = false;
        for (let f = filaInicial; f < datvlo.length; f++) {
            const resultado = procesarFila(datvlo[f], f, pasajerosPatron, asientosReservados, { asientoXL, asientoSalida }, segundaVuelta //añadimos la segunda Vuelta
            );
            if (resultado.colocacionOK) {
                asientosReservados.push(...resultado.asientosReservados);
                filaAsignada = true;
                break;
            }
            // Segunda vuelta para casos especiales de 1 pasajero
            if (pasajerosPatron === 1 && !segundaVuelta && f === datvlo.length - 1) {
                segundaVuelta = true;
                f = filaInicial - 1; // Reiniciar desde el inicio
            }
        }
        // Si no se pudo asignar la fila, el patrón falla
        if (!filaAsignada)
            return null;
    }
    return asientosReservados;
};
const procesarFila = (fila, f, pasajerosPatron, asientosReservados, filtroAsientos, segundaVuelta //añadimos la segunda Vuelta
) => {
    const { asientoXL, asientoSalida } = filtroAsientos;
    let colocacionOK = false;
    let asientosReservadosTmp = [];
    for (let gl = 0; gl < fila.gruposLibres.length; gl++) {
        if (fila.gruposLibres[gl] >= pasajerosPatron) {
            const resultado = procesarGrupo(fila, f, gl, pasajerosPatron, asientosReservados, { asientoXL, asientoSalida }, segundaVuelta //añadimos la segunda Vuelta
            );
            if (resultado.colocacionOK) {
                asientosReservadosTmp = resultado.asientosReservados;
                colocacionOK = true;
                break;
            }
        }
    }
    return { colocacionOK, asientosReservados: asientosReservadosTmp };
};
const procesarGrupo = (fila, f, gl, pasajerosPatron, asientosReservados, filtroAsientos, segundaVuelta //añadimos la segunda Vuelta
) => {
    const { asientoXL, asientoSalida } = filtroAsientos;
    let colocacionOK = false;
    let asientosTmp = []; //
    let contadorDeGaps = 0;
    for (let a = 0; a < fila.asientos.length; a++) {
        const asiento = fila.asientos[a];
        const detalles = asiento.extras ? "," + asiento.extras.join(",") + "," : "";
        if (!asiento.esAsiento)
            contadorDeGaps++;
        let candidato = false; // **reseteamos el candidato
        //mierda por ahorrar lineas si hay 2 ifs es que pueden hacer falta
        if (contadorDeGaps === gl) {
            if (asiento.esAsiento && asiento.disponible) {
                candidato = esCandidatoValido(asiento, detalles, asientoXL, asientoSalida, pasajerosPatron, asientosReservados, f, segundaVuelta //añadimos la segunda Vuelta
                );
            }
            if (candidato) {
                asientosTmp.push({ f, c: asiento.columna, fila: fila.fila });
                if (asientosTmp.length === pasajerosPatron) {
                    colocacionOK = true;
                    break;
                }
            }
            else {
                asientosTmp = []; // Reiniciar si no es válido
            }
        }
    }
    return { colocacionOK, asientosReservados: asientosTmp };
};
const esCandidatoValido = (asiento, detalles, asientoXLPermitido, salidaPermitido, pasajerosPatron, asientosReservados, filaActual, segundaVuelta //añadimos la segunda Vuelta
) => {
    let response = true;
    // Reglas de exclusión
    if ((!asientoXLPermitido && detalles.includes(",L,")) ||
        (!salidaPermitido && detalles.includes(",E,"))) {
        response = false;
        // Restricciones para un solo pasajero ** Ajustado para el control de las vueltas
    }
    else if (pasajerosPatron === 1 && !segundaVuelta && !(detalles.includes(",W,") || detalles.includes(",A,"))) {
        response = false;
    }
    else {
        // Verificar que no esté ya reservado
        response = !asientosReservados.some((res) => res.f === filaActual && res.c === asiento.columna && res.fila === asiento.fila);
    }
    return response;
};
const formatearAsientos = (asientosReservados) => {
    return asientosReservados.map((asiento) => `${asiento.fila}${asiento.c}`).join(",");
};
