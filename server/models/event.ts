import { DataTypes } from 'sequelize';
import sequelize from './modelDB';

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
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
});

export default Event;
