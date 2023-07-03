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
const associations_1 = require("../models/associations");
const uuid_1 = require("uuid");
const utils_1 = require("../utils");
/**
 * @param req needs req.params.eventid
 */
const getChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, uuid_1.validate)(req.params.eventid)) {
        return res.status(400)
            .json((0, utils_1.resBody)(false, "400", null, "Wrong event id"));
    }
    const event = yield associations_1.Event.findOne({
        where: { eventId: req.params.eventid }
    });
    if (!event) {
        return res.status(400)
            .json((0, utils_1.resBody)(false, "400", null, "Event could not be found"));
    }
    try {
        const chat = yield associations_1.EventChat.findAll({
            where: { eventId: req.params.eventid },
        });
        res.status(200)
            .json((0, utils_1.resBody)(true, null, chat, 'Chat fetched'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500)
            .json((0, utils_1.resBody)(false, "500", null, err.message));
    }
});
/**
 * @param req needs body with {"eventId", "userId", "message"}
 */
const newMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.message) {
        return res.status(400)
            .json((0, utils_1.resBody)(false, "400", null, "Missing input message"));
    }
    if (!(0, uuid_1.validate)(req.body.eventId) || !(0, uuid_1.validate)(req.body.userId)) {
        return res.status(400)
            .json((0, utils_1.resBody)(false, "400", null, "Wrong event and/or user id"));
    }
    const user = yield associations_1.User.findOne({
        where: { userId: req.body.userId }
    });
    if (!user) {
        return res.status(400)
            .json((0, utils_1.resBody)(false, "400", null, "User could not be found"));
    }
    const event = yield associations_1.Event.findOne({
        where: { eventId: req.body.eventId }
    });
    if (!event) {
        return res.status(400)
            .json((0, utils_1.resBody)(false, "400", null, "Event could not be found"));
    }
    try {
        const eventChat = yield associations_1.EventChat.create(Object.assign(Object.assign({}, req.body), { date: Date.now() }));
        res.status(201)
            .json((0, utils_1.resBody)(true, null, eventChat, 'Chat message succesfully posted'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500)
            .json((0, utils_1.resBody)(false, "500", null, err.message));
    }
});
exports.default = { getChat, newMessage };
