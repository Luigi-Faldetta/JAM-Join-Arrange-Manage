import User from './user';
import Event from './event';
import Todo from './todo';
import Expense from './expense';
import UserEvent from './userEvent';

Event.belongsTo(User, {
  foreignKey: 'host',
});

Event.belongsToMany(User, {
  through: UserEvent,
  foreignKey: 'eventId',
});

User.belongsToMany(Event, {
  through: UserEvent,
  foreignKey: 'userId',
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

export { User, Event, UserEvent };
