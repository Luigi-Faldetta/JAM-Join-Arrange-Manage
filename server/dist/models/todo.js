'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const modelDB_1 = __importDefault(require("./modelDB"));
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
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    eventId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
});
exports.default = Todo;
