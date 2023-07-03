export interface BeUser {
  name: string,
  userId?: string,
  email: string,
  phone: string,
  profilePic: string,
  password: string,
}

export interface BeEvent {
  eventId: string,
  date?: string,
  location?: string,
  title: string,
  description?: string,
  coverPic: string,
}

export interface BeExpense {
  id: number,
  item: string,
  cost: number,
  purchaserId: string,
  eventId: string,
}

export interface BeUserEvent {
  userId: string,
  eventId: string,
  isHost: boolean,
  isGoing?: boolean,
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

export const resBody = (success: boolean, error: string | null, data: any, message: string) => { return { success, error, data, message } }