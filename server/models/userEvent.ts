import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from './modelDB.js';
import Sequelize from 'sequelize';
import { BeUserEvent } from '../utils.js';

interface UserEventModel extends Model<BeUserEvent>, BeUserEvent {}
export class UserEventClass extends Model<UserEventModel, BeUserEvent> {}

export type UserEventStatic = typeof Model & {
  new(values?:object, options?: BuildOptions):UserEventModel
}

const UserEvent = sequelize.define<UserEventModel>(
  'UserEvent',
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
    },
    isGoing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, { timestamps: false }
);

export default UserEvent;
