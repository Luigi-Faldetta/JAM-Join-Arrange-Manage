import User from './user';
import Event from './event';
import UserEvents from './userEvent';

User.hasMany(Event, {
  foreignKey: 'host',
});

User.belongsToMany(Event, {
  through: UserEvents,
  foreignKey: 'userId',
});

Event.belongsTo(User, {
  foreignKey: 'host',
});

Event.belongsToMany(User, {
  through: UserEvents,
  foreignKey: 'eventId',
});

Event.hasMany(UserEvents, {
  foreignKey: 'eventId',
});

export { User, Event, UserEvents };
