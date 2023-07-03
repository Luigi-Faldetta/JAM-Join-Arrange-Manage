"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventChatClass = void 0;
const sequelize_1 = require("sequelize");
const modelDB_js_1 = __importDefault(require("./modelDB.js"));
const sequelize_2 = __importDefault(require("sequelize"));
class EventChatClass extends sequelize_1.Model {
}
exports.EventChatClass = EventChatClass;
const EventChat = modelDB_js_1.default.define('EventChat', {
    eventId: {
        type: sequelize_2.default.UUID,
        allowNull: false,
    },
    userId: {
        type: sequelize_2.default.UUID,
        allowNull: false,
    },
    message: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    }
}, { timestamps: false });
exports.default = EventChat;
