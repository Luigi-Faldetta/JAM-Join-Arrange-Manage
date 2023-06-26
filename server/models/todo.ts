'use strict';

import { DataTypes } from 'sequelize';
import sequelize from './modelDB';

const Todo = sequelize.define('Todo', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isDone: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  creatorId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Todo;
