"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEvents = exports.Event = exports.User = void 0;
const user_1 = __importDefault(require("./user"));
exports.User = user_1.default;
const event_1 = __importDefault(require("./event"));
exports.Event = event_1.default;
const userEvent_1 = __importDefault(require("./userEvent"));
exports.UserEvents = userEvent_1.default;
event_1.default.belongsTo(user_1.default, {
    foreignKey: 'host',
});
// THIS IS WRONG. USER HAS NO FOREIGN KEY
// User.hasOne(Event, {
//   foreignKey: 'userId',
// });
event_1.default.belongsToMany(user_1.default, {
    through: userEvent_1.default,
    foreignKey: 'XeventId',
});
user_1.default.belongsToMany(event_1.default, {
    through: userEvent_1.default,
    foreignKey: 'XuserId',
});
