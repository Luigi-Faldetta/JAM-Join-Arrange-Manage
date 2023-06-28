"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const modelDB_js_1 = __importDefault(require("./modelDB.js"));
<<<<<<< HEAD
const sequelize_1 = __importDefault(require("sequelize"));
=======
const sequelize_2 = __importDefault(require("sequelize"));
>>>>>>> 4e9092a317cf45a21dbf7e96bbf9f07bde05e3a7
const UserEvents = modelDB_js_1.default.define('UserEvents', {
    userId: {
        type: sequelize_2.default.UUID,
        defaultValue: sequelize_2.default.UUIDV4,
        allowNull: false,
    },
    eventId: {
        type: sequelize_2.default.UUID,
        defaultValue: sequelize_2.default.UUIDV4,
        allowNull: false,
    },
    isHost: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    }
}, { timestamps: false });
exports.default = UserEvents;
