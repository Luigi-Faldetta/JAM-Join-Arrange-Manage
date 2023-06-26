export interface EventTypes {
  eventId: string;
  date: Date;
  location: string;
  title: string;
  host: string;
  description: string;
  coverPic: string;
}

export interface UserTypes {
  userId: string;
  name: string;
  email: string;
  phone: string;
  profilePic: string;
  password: string;
}

export interface ExpenseTypes {
  item: string;
  cost: string;
  purchaseId: string;
  eventId: string;
}

export interface ToDo {
  title: string;
  creatorId: string;
  eventId: string;
  isDone: boolean;
}
