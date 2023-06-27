"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const modelDB_js_1 = __importDefault(require("./modelDB.js"));
const sequelize_1 = __importDefault(require("sequelize"));
const UserEvents = modelDB_js_1.default.define('UserEvents', {
    userId: {
        type: sequelize_1.default.UUID,
        defaultValue: sequelize_1.default.UUIDV4,
        allowNull: false,
    },
    eventId: {
        type: sequelize_1.default.UUID,
        defaultValue: sequelize_1.default.UUIDV4,
        allowNull: false,
    },
}, { timestamps: false });
exports.default = UserEvents;
