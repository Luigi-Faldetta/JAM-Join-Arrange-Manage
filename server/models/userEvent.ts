import sequelize from './modelDB.js';
import Sequelize from 'sequelize';

const UserEvents = sequelize.define(
  'UserEvents',
  {
    userId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    eventId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
  }, { timestamps: false }
);

export default UserEvents;
