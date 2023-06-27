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
// Needs body with at least the next properties {"title": "test title", "host": id} 
const newEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield associations_1.Event.create(req.body);
        res.status(201).json({
            success: true,
            data: event,
            message: 'Event created',
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
// Needs req.params.eventid
const getEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield associations_1.Event.findOne({
            where: { eventId: req.params.eventid }
        });
        res.status(200).json({
            success: true,
            data: event,
            message: 'Event fetched',
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
// Needs req.params.eventid
// Needs body with changes {"title": "new title"} 
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedEvent = yield associations_1.Event.update(req.body, { where: { eventId: req.params.eventid }, returning: true });
        res.status(200).json({
            success: true,
            data: updatedEvent[1][0],
            message: 'Event updated',
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
// Needs req.params.eventid
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedEvent = yield associations_1.Event.destroy({ where: { eventId: req.params.eventid } });
        res.status(200).json({
            success: true,
            data: deletedEvent,
            message: 'Event deleted',
        });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});
// Needs req.params.userid
const getUserEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventIds = yield associations_1.UserEvents.findAll({ where: { userId: req.params.userid } });
        if (eventIds) {
            const eventsArray = [];
            for (const event of eventIds) {
                eventsArray.push(event.dataValues.eventId);
            }
            const events = yield associations_1.Event.findAll({ where: { eventId: eventsArray } });
            res.status(200).json({
                success: true,
                data: events,
                message: 'User events fetched',
            });
        }
        else {
            throw 'No events where found';
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
exports.default = { newEvent, getEvent, updateEvent, deleteEvent, getUserEvents };
