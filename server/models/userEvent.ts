import { DataTypes } from 'sequelize';
import sequelize from './modelDB.js';
import Sequelize from 'sequelize';

const UserEvent = sequelize.define(
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
    isHost: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    }
  }, { timestamps: false }
);

export default UserEvent;
