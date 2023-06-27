import { DataTypes, Model, BuildOptions  } from 'sequelize';
import sequelize from './modelDB';
import Sequelize from 'sequelize';

const Event = sequelize.define('Event', {
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
  host: {
    type: Sequelize.UUID,
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
