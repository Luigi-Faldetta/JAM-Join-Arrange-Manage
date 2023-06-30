"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const modelDB_js_1 = __importDefault(require("./modelDB.js"));
const sequelize_2 = __importDefault(require("sequelize"));
const UserEvent = modelDB_js_1.default.define('UserEvents', {
    userId: {
        type: sequelize_2.default.UUID,
        allowNull: false,
    },
    eventId: {
        type: sequelize_2.default.UUID,
        allowNull: false,
    },
    isHost: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isGoing: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, { timestamps: false });
exports.default = UserEvent;
