'use strict';

import { DataTypes } from 'sequelize';
import sequelize from './modelDB';

const Expense = sequelize.define('Expense', {
  item: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cost: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  purchaserId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Expense;
