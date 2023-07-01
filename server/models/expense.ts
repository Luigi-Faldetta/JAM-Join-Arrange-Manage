import { BuildOptions, DataTypes, Model, ModelAttributes } from 'sequelize';
import sequelize from './modelDB';
import Sequelize from 'sequelize';
import { BeExpense} from '../utils';

interface ExpenseModel extends Model<BeExpense>, BeExpense {}
export class ExpenseClass extends Model<ExpenseModel, BeExpense> {}

export type ExpenseStatic = typeof Model & {
  new(values?:object, options?: BuildOptions):ExpenseModel
}

const Expense = <ExpenseStatic>sequelize.define('Expense', {
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
    allowNull: false,
  },
  eventId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
}, { timestamps: false });

export default Expense;
