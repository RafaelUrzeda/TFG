export interface deletePnrElements {
    actionCode: number;
    cancelType: string;
    cancelElements: cancelElements[];
}

export interface cancelElements {
    identifier: string;
    number: string;
}