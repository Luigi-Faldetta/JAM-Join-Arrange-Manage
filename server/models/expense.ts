import { DataTypes } from 'sequelize';
import sequelize from './modelDB';

const Expense = sequelize.define('Expense', {
  item: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cost: {
    type: DataTypes.INTEGER,
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
}, { timestamps: false });

export default Expense;
