"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const modelDB_1 = __importDefault(require("./modelDB"));
const sequelize_2 = __importDefault(require("sequelize"));
const closedExpense = modelDB_1.default.define('ClosedExpenses', {
    eventId: {
        type: sequelize_2.default.UUID,
        allowNull: false,
    },
    userId: {
        type: sequelize_2.default.UUID,
        allowNull: false,
    },
    spent: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    target: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    difference: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    total: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, { timestamps: false });
exports.default = closedExpense;
