import User from './user';
import Event from './event';
import Todo from './todo';
import Expense from './expense';
import UserEvent from './userEvent';
import EventChat from './eventChat';
import ExpenseSettlement from './expenseSettlement';

Event.belongsToMany(User, {
  through: UserEvent,
  foreignKey: 'eventId',
});

User.belongsToMany(Event, {
  through: UserEvent,
  foreignKey: 'userId',
});

Event.hasMany(UserEvent, {
  foreignKey: 'eventId'
});

User.hasMany(UserEvent, {
  foreignKey: 'userId'
});

UserEvent.belongsTo(User, {
  foreignKey: 'userId'
});

Todo.belongsTo(Event, {
  foreignKey: 'eventId',
});

Todo.belongsTo(User, {
  foreignKey: 'creatorId',
});

Expense.belongsTo(Event, {
  foreignKey: 'eventId',
});

Expense.belongsTo(User, {
  foreignKey: 'purchaserId',
});

Event.hasMany(EventChat, {
  foreignKey: 'eventId'
});

User.hasMany(EventChat, {
  foreignKey: 'userId'
});

EventChat.belongsTo(User, {
  foreignKey: 'userId'
});

EventChat.belongsTo(Event, {
  foreignKey: 'eventId'
});

ExpenseSettlement.belongsTo(Event, {
  foreignKey: 'eventId',
});

ExpenseSettlement.belongsTo(User, {
  foreignKey: 'payerId',
  as: 'Payer',
});

ExpenseSettlement.belongsTo(User, {
  foreignKey: 'receiverId',
  as: 'Receiver',
});

Event.hasMany(ExpenseSettlement, {
  foreignKey: 'eventId'
});

User.hasMany(ExpenseSettlement, {
  foreignKey: 'payerId',
  as: 'PayerSettlements'
});

User.hasMany(ExpenseSettlement, {
  foreignKey: 'receiverId',
  as: 'ReceiverSettlements'
});

export { User, Event, UserEvent, EventChat, ExpenseSettlement };
