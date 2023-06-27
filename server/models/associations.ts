import User from './user';
import Event from './event';
import UserEvents from './userEvent';

Event.belongsTo(User, {
  foreignKey: 'host',
});

// THIS IS WRONG. USER HAS NO FOREIGN KEY
// User.hasOne(Event, {
//   foreignKey: 'userId',
// });

Event.belongsToMany(User, {
  through: UserEvents,
  foreignKey: 'XeventId',
});

User.belongsToMany(Event, {
  through: UserEvents,
  foreignKey: 'XuserId',
});

// Event.hasMany(UserEvents, {
//   foreignKey: 'eventId',
// });


export { User, Event, UserEvents };
