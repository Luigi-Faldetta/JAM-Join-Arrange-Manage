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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const userEvent_1 = __importDefault(require("../models/userEvent"));
/**
 * @param req needs body with at least {"userId", "eventId"} Optional "isHost" and "isGoing"
 */
const joinEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userEvent_1.default.create(req.body);
        res.status(201)
            .json((0, utils_1.resBody)(true, null, null, 'User joined the activity'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.log(err);
        res.status(500)
            .json((0, utils_1.resBody)(false, null, null, err.message));
    }
});
/**
 * @param req needs body with "userId", "eventId" and updates to "isHost" and/or "isGoing"
 */
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedEvent = yield userEvent_1.default.update(req.body, {
            where: { userId: req.body.userId, eventId: req.body.eventId },
            returning: true
        });
        res.status(200)
            .json((0, utils_1.resBody)(true, null, updatedEvent[1][0], 'User event properties updated'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500)
            .json((0, utils_1.resBody)(false, null, null, err.message));
    }
});
/**
 * @param req needs body with {"userId", "eventId"}
 */
const leaveEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userEvent_1.default.destroy({
            where: req.body,
        });
        res.status(200)
            .json((0, utils_1.resBody)(true, null, null, 'User left the activity'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.log(err);
        res.status(400)
            .json((0, utils_1.resBody)(false, null, null, err.message));
    }
});
exports.default = { joinEvent, updateEvent, leaveEvent };
