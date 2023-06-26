"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./user"));
const event_1 = __importDefault(require("./event"));
const userEvent_1 = __importDefault(require("./userEvent"));
user_1.default.hasMany(event_1.default, {
    foreignKey: 'host',
});
user_1.default.belongsToMany(event_1.default, {
    through: userEvent_1.default,
    foreignKey: 'userId',
});
event_1.default.belongsTo(user_1.default, {
    foreignKey: 'host',
});
event_1.default.belongsToMany(user_1.default, {
    through: userEvent_1.default,
    foreignKey: 'eventId',
});
event_1.default.hasMany(userEvent_1.default, {
    foreignKey: 'eventId',
});
exports.default = { User: user_1.default, Event: event_1.default, UserEvents: userEvent_1.default };
