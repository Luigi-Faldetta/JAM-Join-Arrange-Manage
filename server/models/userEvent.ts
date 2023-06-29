import { DataTypes } from 'sequelize';
import sequelize from './modelDB.js';
import Sequelize from 'sequelize';

const UserEvent = sequelize.define(
  'UserEvents',
  {
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    eventId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    isHost: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isGoing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    }
  }, { timestamps: false }
);

export default UserEvent;
