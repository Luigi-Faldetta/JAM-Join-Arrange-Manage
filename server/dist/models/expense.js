'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const modelDB_1 = __importDefault(require("./modelDB"));
const Expense = modelDB_1.default.define('Expense', {
    item: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    cost: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    purchaserId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    eventId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
});
exports.default = Expense;
