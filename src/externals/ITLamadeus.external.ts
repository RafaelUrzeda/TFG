import { executeQuery } from '../database/internalTravel.postgre.datasource';


const getAmadeus = async (idReserva: number | string): Promise<any> => {
    const query = "SELECT amadeusbooking FROM ITL_RESERVAS_AMADEUS WHERE IDRESERVA = $1";
    const values = [idReserva || ''];
    const response = await executeQuery({ text: query, values });
    return response.rows[0].amadeusbooking;

    const pete = {
        data: {
            pnr: {
                "pnrHeader": {
                    "reservationInfo": {
                        "reservation": {
                            "companyId": "1A"
                        }
                    }
                },
                "securityInformation": {
                    "responsibilityInformation": {
                        "typeOfPnrElement": "RP",
                        "officeId": "OFICINA123",
                        "iataCode": "123456789"
                    },
                    "queueingInformation": {
                        "queueingOfficeId": "OFICINA123"
                    },
                    "cityCode": "PMI"
                },
                "sbrPOSDetails": {
                    "sbrUserIdentificationOwn": {
                        "originIdentification": {
                            "inHouseIdentification1": ""
                        }
                    },
                    "sbrSystemDetails": {
                        "deliveringSystem": {
                            "companyId": ""
                        }
                    },
                    "sbrPreferences": {
                        "userPreferences": {
                            "codedCountry": ""
                        }
                    }
                },
                "sbrCreationPosDetails": {
                    "sbrUserIdentificationOwn": {
                        "originIdentification": {
                            "inHouseIdentification1": ""
                        }
                    },
                    "sbrSystemDetails": {
                        "deliveringSystem": {
                            "companyId": ""
                        }
                    },
                    "sbrPreferences": {
                        "userPreferences": {
                            "codedCountry": ""
                        }
                    }
                },
                "sbrUpdatorPosDetails": {
                    "sbrUserIdentificationOwn": {
                        "originIdentification": {
                            "originatorId": "123456789",
                            "inHouseIdentification1": "OFICINA123"
                        },
                        "originatorTypeCode": "A"
                    },
                    "sbrSystemDetails": {
                        "deliveringSystem": {
                            "companyId": "UX",
                            "locationId": "PMI"
                        }
                    },
                    "sbrPreferences": {
                        "userPreferences": {
                            "codedCountry": "ES"
                        }
                    }
                },
                "originDestinationDetails": [{
                    "originDestination": "",
                    "itineraryInfo": [{
                        "elementManagementItinerary": {
                            "reference": {
                                "qualifier": "ST",
                                "number": "1"
                            },
                            "segmentName": "AIR",
                            "lineNumber": "1"
                        },
                        "travelProduct": {
                            "product": {
                                "depDate": "100425",
                                "depTime": "1040",
                                "arrDate": "100425",
                                "arrTime": "1205"
                            },
                            "boardpointDetail": {
                                "cityCode": "PMI"
                            },
                            "offpointDetail": {
                                "cityCode": "MAD"
                            },
                            "companyDetail": {
                                "identification": "UX"
                            },
                            "productDetails": {
                                "identification": "6030",
                                "classOfService": "O"
                            },
                            "typeDetail": {
                                "detail": "ET"
                            }
                        },
                        "itineraryMessageAction": {
                            "business": {
                                "function": "1"
                            }
                        },
                        "relatedProduct": {
                            "quantity": "2",
                            "status": "HK"
                        },
                        "flightDetail": {
                            "productDetails": {
                                "equipment": "73H",
                                "numOfStops": "0",
                                "weekDay": "4"
                            },
                            "arrivalStationInfo": {
                                "terminal": "2"
                            },
                            "facilities": {
                                "entertainement": "M",
                                "entertainementDescription": "S"
                            }
                        },
                        "selectionDetails": {
                            "selection": {
                                "option": "P2"
                            }
                        },
                        "carbonDioxydeInfo": {
                            "carbonDioxydeAmount": {
                                "quantityDetails": {
                                    "qualifier": "COP",
                                    "value": "61.902679",
                                    "unit": "KPP"
                                }
                            },
                            "carbonDioxydeInfoSource": {
                                "freeTextDetails": {
                                    "textSubjectQualifier": "3",
                                    "source": "S",
                                    "encoding": "7"
                                },
                                "freeText": "SOURCE:ICAO CARBON EMISSIONS CALCULATOR"
                            }
                        },
                        "itineraryfreeFormText": {
                            "freeTextQualification": {
                                "textSubjectQualifier": "3"
                            },
                            "freeText": "SEE RTSVC"
                        },
                        "distributionMethod": {
                            "distributionMethodDetails": {
                                "distriProductCode": "E"
                            }
                        },
                        "customerTransactionData": {
                            "pos": {
                                "classification": "C",
                                "crs": "UX",
                                "pointOfSaleCountry": "ES"
                            },
                            "flight": {
                                "cabin": "J",
                                "subclass": "0",
                                "flightType": "D"
                            }
                        },
                        "yieldGroup": {
                            "yieldData": "",
                            "yieldDataGroup": {
                                "yieldInformations": {
                                    "monetaryDetails": {
                                        "typeQualifier": "Y",
                                        "amount": "22"
                                    },
                                    "otherMonetaryDetails": [
                                        {
                                            "typeQualifier": "B",
                                            "amount": "14"
                                        },
                                        {
                                            "typeQualifier": "E",
                                            "amount": "0"
                                        }
                                    ]
                                },
                                "ondyield": {
                                    "origin": "PMI",
                                    "destination": "MAD"
                                },
                                "tripOnD": {
                                    "origin": "PMI",
                                    "destination": "MAD"
                                }
                            }
                        },
                        "markerRailTour": ""
                    }]
                }],
                "_xmlns": "http://xml.amadeus.com/PNRACC_21_1_1A"
            }
        },
        headers: {
            amadeussession: 'session123'
        }
    }

}

export { getAmadeus };

