"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const modelDB_1 = __importDefault(require("./modelDB"));
const sequelize_2 = __importDefault(require("sequelize"));
const Todo = modelDB_1.default.define('Todo', {
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    isDone: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    creatorId: {
        type: sequelize_2.default.UUID,
        defaultValue: sequelize_2.default.UUIDV4,
        allowNull: false,
    },
    eventId: {
        type: sequelize_2.default.UUID,
        defaultValue: sequelize_2.default.UUIDV4,
        allowNull: false,
    },
}, { timestamps: false });
exports.default = Todo;
