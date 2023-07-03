import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from './modelDB.js';
import Sequelize from 'sequelize';
import { BeEventChat } from '../utils.js';

interface EventChatModel extends Model<BeEventChat>, BeEventChat {}
export class EventChatClass extends Model<EventChatModel, BeEventChat> {}

export type EventChatStatic = typeof Model & {
  new(values?:object, options?: BuildOptions):EventChatModel
}

const EventChat = sequelize.define<EventChatModel>(
  'EventChat',
  {
    eventId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, { timestamps: false }
);

export default EventChat;
