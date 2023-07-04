"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMessageSocket = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("../utils");
const associations_1 = require("../models/associations");
const addMessageSocket = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { message, userId, eventId } = options;
    if (!message) {
        return (0, utils_1.resBody)(false, "400", null, "Missing input message");
    }
    if (!(0, uuid_1.validate)(userId) || !(0, uuid_1.validate)(eventId)) {
        return (0, utils_1.resBody)(false, "400", null, "Wrong event and/or user id");
    }
    const user = yield associations_1.User.findOne({
        where: { userId }
    });
    if (!user) {
        return (0, utils_1.resBody)(false, "400", null, "User could not be found");
    }
    const event = yield associations_1.Event.findOne({
        where: { eventId }
    });
    if (!event) {
        return (0, utils_1.resBody)(false, "400", null, "Event could not be found");
    }
    try {
        const eventChat = yield associations_1.EventChat.create(Object.assign(Object.assign({}, options), { date: Date.now() }));
        const eventToReturn = yield associations_1.EventChat.findOne({ where: { userId, eventId, message, date: eventChat.date },
            include: [{
                    model: associations_1.User,
                    attributes: ['name', 'profilePic'],
                }] });
        return (0, utils_1.resBody)(true, null, eventToReturn, 'Chat message succesfully posted');
    }
    catch (error) {
        process.env.NODE_ENV !== 'test' && console.error(error);
        return (0, utils_1.resBody)(false, "500", null, error.message);
    }
});
exports.addMessageSocket = addMessageSocket;
