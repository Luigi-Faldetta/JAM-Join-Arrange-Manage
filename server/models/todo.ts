import { DataTypes } from 'sequelize';
import sequelize from './modelDB';
import Sequelize from 'sequelize';

const Todo = sequelize.define('Todo', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isDone: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  creatorId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  eventId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
}, { timestamps: false });

export default Todo;
