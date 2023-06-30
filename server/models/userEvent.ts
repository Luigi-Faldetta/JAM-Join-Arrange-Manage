import { DataTypes, Model } from 'sequelize';
import sequelize from './modelDB.js';
import Sequelize from 'sequelize';
import { BeUserEvent } from '../utils.js';

interface UserEventModel extends Model, BeUserEvent {}

const UserEvent = sequelize.define<UserEventModel>(
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
