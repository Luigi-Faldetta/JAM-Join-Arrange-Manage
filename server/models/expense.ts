import { DataTypes } from 'sequelize';
import sequelize from './modelDB';
import Sequelize from 'sequelize';

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
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  eventId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
}, { timestamps: false });

export default Expense;
