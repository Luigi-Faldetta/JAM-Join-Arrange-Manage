"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEvent = exports.Event = exports.User = void 0;
const user_1 = __importDefault(require("./user"));
exports.User = user_1.default;
const event_1 = __importDefault(require("./event"));
exports.Event = event_1.default;
const todo_1 = __importDefault(require("./todo"));
const expense_1 = __importDefault(require("./expense"));
const userEvent_1 = __importDefault(require("./userEvent"));
exports.UserEvent = userEvent_1.default;
event_1.default.belongsToMany(user_1.default, {
    through: userEvent_1.default,
    foreignKey: 'eventId',
});
user_1.default.belongsToMany(event_1.default, {
    through: userEvent_1.default,
    foreignKey: 'userId',
});
event_1.default.hasMany(userEvent_1.default, {
    foreignKey: 'eventId'
});
user_1.default.hasMany(userEvent_1.default, {
    foreignKey: 'userId'
});
userEvent_1.default.belongsTo(user_1.default, {
    foreignKey: 'userId'
});
todo_1.default.belongsTo(event_1.default, {
    foreignKey: 'eventId',
});
todo_1.default.belongsTo(user_1.default, {
    foreignKey: 'creatorId',
});
expense_1.default.belongsTo(event_1.default, {
    foreignKey: 'eventId',
});
expense_1.default.belongsTo(user_1.default, {
    foreignKey: 'purchaserId',
});
