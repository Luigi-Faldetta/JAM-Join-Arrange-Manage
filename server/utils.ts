// export function BeResponse = (
//     success: boolean,
//     data: any,
//     message: string,
//     error: null | number,
// ) => {success, data, message, error}

export interface BeExpense {
    id: number,
    item: string,
    cost: number,
    purchaserId: string,
    eventId: string,
}

export interface BeUser {
    name: string,
    userId?: string,
    email: string,
    phone: string,
    profilePic: string,
    password: string,
}

export interface BeUserEvent {
    userId: string,
    eventId: string,
    isHost: boolean,
    isGoing: boolean,
}

export interface BeEventChat {
    userId: string,
    eventId: string,
    message: string,
    date: string,
}

export interface IndExpense {
    name: string,
    owes: number,
}

//@ts-ignore
export const resBody = (success, error, data, message) => { return { success, error, data, message } }
