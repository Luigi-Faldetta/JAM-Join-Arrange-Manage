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
    allowNull: false,
  },
  YcreatorId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  YeventId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
}, { timestamps: false });

export default Todo;
