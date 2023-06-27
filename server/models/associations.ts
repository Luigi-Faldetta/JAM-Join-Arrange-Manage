import User from './user';
import Event from './event';
import Todo from './todo';
import Expense from './expense';
import UserEvents from './userEvent';

Event.belongsTo(User, {
  foreignKey: 'host',
});

Event.belongsToMany(User, {
  through: UserEvents,
  foreignKey: 'XeventId',
});

User.belongsToMany(Event, {
  through: UserEvents,
  foreignKey: 'XuserId',
});

Todo.belongsTo(Event, {
  foreignKey: 'YeventId',
});

Todo.belongsTo(User, {
  foreignKey: 'YcreatorId',
});

Expense.belongsTo(Event, {
  foreignKey: 'eventId',
});

Expense.belongsTo(User, {
  foreignKey: 'purchaserId',
});

export { User, Event, UserEvents };
