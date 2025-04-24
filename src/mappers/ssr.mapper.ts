import { Booking, ContactInformationMail, ContactInformationTf, ElementsDB, FormOfPayment, ReferencePair, Remark, ResidentDiscount, SSR } from '../interfaces/interface.index';

//Magic strings constants and regex
const FZ = 'FZ';
const FD = 'FD';
const APE = 'APE';
const AP = 'AP';
const RF = 'RF';
const CTCE = 'CTCE';
const CTCM = 'CTCM';
const SR = 'SR';
const DOCS = 'DOCS';
const FT = 'FT';
const FE = 'FE';
const TK = 'TK';
const RM = 'RM';
const SI = 'SI';
const OS = 'OS';
const FP = 'FP';
const DOCUMENT_REGEX = /([X-Z]\d{7}[A-Z]|\d{8}[A-Z])/;
const SPACE_OR_SLASH_REGEX = /[\s/]+/;
const NIE_PREFIX_REGEX = /^[X-Z]/;
const NIF_REGEX = /^\d{8}/;
const DIACRITICS_REGEX = /[\u0300-\u036f]/g;



export const mapSsrToRoot = (ssrData: ElementsDB[], itlBooking: Booking) => {
    const ssrArray: SSR[] = [];
    const osiRemarks: Remark[] = [];
    const skRemarks: SSR[] = [];
    const fareTourCode: { freeText: string; paxReference: ReferencePair[] }[] = [];
    const residentDiscounts: ResidentDiscount[] = [];
    const remarks: Remark[] = [];
    const fareEndorsementRemarks: string[] = [];
    const fops: FormOfPayment[] = [];
    let tkok: boolean = false;

    ssrData.forEach(data => {
        const {
            tipoelemento,
            codssr,
            txtssr,
            numleg,
            numpax,
            ciassr,
            accssr,
        } = data;

        switch (tipoelemento) {
            case CTCE:
            case CTCM:
            case SR: {
                if (codssr === DOCS) {
                    const ssr: SSR = {
                        type: tipoelemento,
                        freeText: txtssr.normalize('NFD').replace(DIACRITICS_REGEX, "").replace('-ms-', '-f-'),
                    };

                    if (accssr) {
                        ssr.status = {
                            type: accssr,
                        };
                    }

                    if (numleg) {
                        if (numleg !== 'P') {
                            ssr.flightsReference = [{ id: numleg }];
                        }
                    }

                    if (numpax) {
                        ssr.paxReference = [{ id: numpax }];
                    }

                    if (ciassr) {
                        ssr.companyId = ciassr;
                    }

                    if (codssr) {
                        ssr.type = codssr;
                    }

                    ssrArray.push(ssr);
                    break;
                }

                const ssr: SSR = {
                    type: codssr,
                    freeText: txtssr,
                };

                if (accssr) {
                    ssr.status = {
                        type: accssr,
                    };
                }

                if (numleg) {
                    if (numleg !== 'P') {
                        ssr.flightsReference = [{ id: parseInt(numleg) }];
                    }
                }

                if (numpax) {
                    ssr.paxReference = [{ id: numpax }];
                }

                if (ciassr) {
                    ssr.companyId = ciassr;
                }

                ssrArray.push(ssr);
                break;
            }

            case OS: {
                const osiRemark: Remark = {
                    type: 'OS',
                    freeText: txtssr
                };

                if (ciassr) {
                    osiRemark.companyId = ciassr;
                }

                osiRemarks.push(osiRemark);
                break;
            }

            case FT: {
                fareTourCode.push({
                    freeText: txtssr,
                    paxReference: numpax ? [{ id: numpax }] : []
                });
                break;
            }

            case FE: {
                fareEndorsementRemarks.push(txtssr);
                break;
            }
            case RF: {
                break;
            }

            case TK: {
                if (txtssr === 'OK') {
                    tkok = true;
                }
                break;
            }

            case RM:
            case SI: {
                remarks.push({
                    type: tipoelemento,
                    freeText: txtssr
                });
                break;
            }

            case APE:
            case AP: {
                break;
            }

            case FZ:
            case FD: {
                break;
            }

            case FP: {
                const formsOfPayment: FormOfPayment = {
                    reference: txtssr,
                    paxReference: numpax ? [{ id: numpax }] : undefined
                }
                fops.push(formsOfPayment);
                break;
            }

            default: {
                const ssr: SSR = {
                    type: tipoelemento,
                    freeText: txtssr,
                };

                if (accssr) {
                    ssr.status = {
                        type: accssr,
                    };
                }

                if (numleg) {
                    if (numleg !== 'P') {
                        ssr.flightsReference = [{ id: numleg }];
                    }
                }

                if (numpax) {
                    ssr.paxReference = [{ id: numpax }];
                }

                if (ciassr) {
                    ssr.companyId = ciassr;
                }

                if (codssr && tipoelemento !== FZ) {
                    ssr.type = codssr;
                }

                ssrArray.push(ssr);
                break;
            }
        }
    });

    Object.assign(itlBooking, {
        ssrs: ssrArray.length ? ssrArray : undefined,
        osiRemarks: osiRemarks.length ? osiRemarks : undefined,
        skRemarks: skRemarks.length ? skRemarks : undefined,
        fareTourCode: fareTourCode.length ? fareTourCode : undefined,
        residentDiscounts: residentDiscounts.length ? residentDiscounts : undefined,
        fops: fops.length ? fops : undefined,
        remarks: remarks.length ? remarks : undefined,
        tkok: tkok || undefined,
        fareEndorsementRemarks: fareEndorsementRemarks.length ? fareEndorsementRemarks : undefined,
    });

    Object.keys(itlBooking).forEach(key => {
        const typedKey = key as keyof Booking;
        if (itlBooking[typedKey] === undefined) {
            delete itlBooking[typedKey];
        }
    });

};

export const mapResidentDiscount = (ssrData: ElementsDB[], itlBooking: Booking): Booking => {

    const residentDiscounts: ResidentDiscount[] = [];
    // group by NUMPAX
    const elements = filterFDFZcomosellamenEls(ssrData);

    for (const key in elements) {

        if (Object.prototype.hasOwnProperty.call(elements, key)) {

            const element = elements[key];

            const residentDiscountElement = element.find((el) => el.tipoelemento === FD);
            const fzElement = element.find((elemento) => elemento.tipoelemento === FZ);
            const fzText = fzElement ? fzElement.txtssr : '';

            if (residentDiscountElement && fzText) {

                const residentDiscountData: ResidentDiscount = mapStringToObject(residentDiscountElement.txtssr);
                residentDiscountData.paxReference = { id: residentDiscountElement.numpax };
                // delete first / from fzline
                residentDiscountData.fzLine = "NM" + fzText;

                residentDiscounts.push(residentDiscountData);
            }
        }
    }
    Object.assign(itlBooking, {
        residentDiscounts: residentDiscounts.length ? residentDiscounts : undefined,
    });
    return itlBooking;
};

export const mapContactInformation = (ssrData: ElementsDB[], itlBooking: Booking): Booking => {
    const contactInformation: (ContactInformationTf | ContactInformationMail)[] = [];

    const elements = filterContactInfoEls(ssrData);

    for (const key in elements) {
        if (Object.prototype.hasOwnProperty.call(elements, key)) {
            const element = elements[key];

            element.forEach(el => {
                const { txtssr, numpax } = el;

                const isEmail = txtssr.includes("@");
                const exists = txtssr && txtssr !== '' && txtssr !== null;

                if (isEmail && exists) {
                    contactInformation.push({
                        email: txtssr,
                        paxReference: numpax ? [{ id: numpax }] : undefined
                    });
                } else if (exists) {
                    contactInformation.push({
                        telephone: txtssr,
                        paxReference: numpax ? [{ id: numpax }] : undefined
                    });
                }
            });
        }
    }

    if (!itlBooking.contactInformation) {
        itlBooking.contactInformation = [];
    }

    itlBooking.contactInformation.push(...contactInformation);

    return itlBooking;
}

export const mapRF = (elements: ElementsDB[], itlBooking: Booking) => {
    const rfElement = elements.find((element) => element.tipoelemento === RF);
    if (rfElement) {
        itlBooking.rf = rfElement.txtssr;
    }
}
const filterContactInfoEls = (els: ElementsDB[]) => {

    return filterAndGroupElements(els, [AP, APE])
}


const filterFDFZcomosellamenEls = (els: ElementsDB[] ) => {

    return filterAndGroupElements(els, [FD, FZ])
}


const filterAndGroupElements = (elements: ElementsDB[], types: string[]) => {
    let filteredElements = elements;
    // filter elements equal to 'APE' or 'AP'
    if (types.includes(APE) && types.includes(AP)) {
        filteredElements = elements.filter(
            (element) => element.tipoelemento === APE || element.tipoelemento === AP
        );
    } else if (types.includes(FZ) && types.includes(FD)) {
        filteredElements = elements.filter(
            (element) => element.tipoelemento === FZ || element.tipoelemento === FD
        );
    }

    // group by NUMPAX
    const groupedElements: { [key: string]: ElementsDB[] } = filteredElements.reduce((acc, element) => {
        const key = element.numpax;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(element);
        return acc;
    }, {} as { [key: string]: ElementsDB[] });

    return groupedElements;
}

const mapStringToObject = (input: string): any => {
    const inputWithoutPax = input.split(' ').slice(1);
    const discountType = inputWithoutPax.shift();
    const parts = inputWithoutPax.join(' ').split(SPACE_OR_SLASH_REGEX);
    const documentType = parts[0];
    const documentNumberWithLetter = parts[1];

    // Extract the number and letters from the document
    const match = documentNumberWithLetter.match(DOCUMENT_REGEX);

    let documentNumber = '';
    let prefixLetter: string | undefined = undefined;
    let suffixLetter: string | undefined = undefined;

    // if NIF or NIE ok
    if (match) {
        const doc = match[0];

        if (NIE_PREFIX_REGEX.test(doc)) {
            prefixLetter = doc.slice(0, 1);
            documentNumber = doc.slice(1, -1);
            suffixLetter = doc.slice(-1);
        }
        else if (NIF_REGEX.test(doc)) {
            documentNumber = doc.slice(0, 8);
            suffixLetter = doc.slice(-1);
        }
    }

    const zipCode = parts[2];

    return {
        discountType,
        documentType,
        documentNumber,
        prefixLetter,
        suffixLetter,
        zipCode,
    };
};
