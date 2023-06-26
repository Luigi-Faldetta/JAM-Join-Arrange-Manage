interface EventTypes {
  eventId: string;
  date: Date;
  location: string;
  title: string;
  host: string;
  description: string;
  coverPic: string;
}

interface UserTypes {
  userId: string;
  name: string;
  email: string;
  phone: string;
  profilePic: string;
  password: string;
}

interface ExpenseTypes {
  item: string;
  cost: string;
  purchaseId: string;
  eventId: string;
}

interface TodoTypes {
  title: string;
  creatorId: string;
  eventId: string;
  isDone: boolean;
}

export { EventTypes, UserTypes, ExpenseTypes, TodoTypes };
