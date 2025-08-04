"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserClass = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("sequelize"));
const modelDB_1 = __importDefault(require("./modelDB"));
class UserClass extends sequelize_1.Model {
}
exports.UserClass = UserClass;
const User = modelDB_1.default.define('User', {
    userId: {
        type: sequelize_2.default.UUID,
        defaultValue: sequelize_2.default.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    profilePic: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, { timestamps: false });
exports.default = User;
