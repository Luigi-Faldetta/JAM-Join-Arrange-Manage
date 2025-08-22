import { BuildOptions, DataTypes, Model, ModelAttributes } from 'sequelize';
import sequelize from './modelDB';
import Sequelize from 'sequelize';

interface ExpenseSettlementAttributes {
  id?: string;
  eventId: string;
  payerId: string;
  receiverId: string;
  amount: number;
  payerConfirmed: boolean;
  receiverConfirmed: boolean;
  payerConfirmedAt?: Date;
  receiverConfirmedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ExpenseSettlementModel extends Model<ExpenseSettlementAttributes>, ExpenseSettlementAttributes {}
export class ExpenseSettlementClass extends Model<ExpenseSettlementModel, ExpenseSettlementAttributes> {}

export type ExpenseSettlementStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ExpenseSettlementModel;
}

const ExpenseSettlement = <ExpenseSettlementStatic>sequelize.define('ExpenseSettlement', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  eventId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  payerId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  receiverId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  payerConfirmed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  receiverConfirmed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  payerConfirmedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  receiverConfirmedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, { 
  timestamps: true,
  indexes: [
    {
      fields: ['eventId']
    },
    {
      fields: ['payerId']
    },
    {
      fields: ['receiverId']
    }
  ]
});

export default ExpenseSettlement;