import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from './modelDB';
import Sequelize from 'sequelize';
import { BeEvent } from '../utils';

interface EventModel extends Model<BeEvent>, BeEvent {}
export class EventClass extends Model<EventModel, BeEvent> {}

export type EventStatic = typeof Model & {
  new(values?:object, options?: BuildOptions): EventModel
}

const Event = <EventStatic>sequelize.define<EventModel>('Event', {
  eventId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true 
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  coverPic: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, { timestamps: false });

export default Event;
