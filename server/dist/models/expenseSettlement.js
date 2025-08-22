"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseSettlementClass = void 0;
const sequelize_1 = require("sequelize");
const modelDB_1 = __importDefault(require("./modelDB"));
const sequelize_2 = __importDefault(require("sequelize"));
class ExpenseSettlementClass extends sequelize_1.Model {
}
exports.ExpenseSettlementClass = ExpenseSettlementClass;
const ExpenseSettlement = modelDB_1.default.define('ExpenseSettlement', {
    id: {
        type: sequelize_2.default.UUID,
        defaultValue: sequelize_2.default.UUIDV4,
        primaryKey: true,
    },
    eventId: {
        type: sequelize_2.default.UUID,
        allowNull: false,
    },
    payerId: {
        type: sequelize_2.default.UUID,
        allowNull: false,
    },
    receiverId: {
        type: sequelize_2.default.UUID,
        allowNull: false,
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    payerConfirmed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    receiverConfirmed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    payerConfirmedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    receiverConfirmedAt: {
        type: sequelize_1.DataTypes.DATE,
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
exports.default = ExpenseSettlement;
