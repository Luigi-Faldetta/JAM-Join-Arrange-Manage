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
const associations_js_1 = require("../models/associations.js");
const uuid_1 = require("uuid");
const utils_1 = require("../utils");
/**
 * Create a new event - ORIGINAL SIGNATURE PRESERVED
 * @param req needs body with at least {"title"} and params.userid
 */
const newEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate userid parameter (keeping original validation)
    if (!(0, uuid_1.validate)(req.params.userid)) {
        return res.status(400).json((0, utils_1.resBody)(false, '400', null, 'Wrong uuid'));
    }
    // Check if user exists (keeping original validation)
    const user = yield associations_js_1.User.findOne({
        where: { userId: req.params.userid },
    });
    if (!user) {
        return res.status(400).json((0, utils_1.resBody)(false, '400', null, 'Wrong host id'));
    }
    // Validate required fields (keeping original validation)
    if (!req.body.title) {
        return res
            .status(400)
            .json((0, utils_1.resBody)(false, '400', null, 'Missing input data'));
    }
    try {
        // Create event (enhanced with additional fields but backward compatible)
        const eventData = {
            eventId: (0, uuid_1.v4)(),
            title: req.body.title,
            description: req.body.description || null,
            date: req.body.date || new Date(),
            location: req.body.location || null,
            coverPic: req.body.coverPic || null,
            hostId: req.params.userid,
        };
        const event = yield associations_js_1.Event.create(eventData);
        // Create host relationship (keeping original logic)
        yield associations_js_1.UserEvent.create({
            userId: req.params.userid,
            eventId: event.eventId,
            isHost: true,
            isGoing: true, // Hosts should be attending their own events
        });
        // Return event in original format
        const eventToReturn = yield associations_js_1.Event.findOne({
            where: { eventId: event.eventId },
            include: [
                {
                    model: associations_js_1.UserEvent,
                    where: { userId: req.params.userid },
                    attributes: ['userId', 'isHost', 'isGoing'],
                },
            ],
        });
        res
            .status(201)
            .json((0, utils_1.resBody)(true, null, eventToReturn, 'Event created and linked to host'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500).json((0, utils_1.resBody)(false, '500', null, err.message));
    }
});
/**
 * Get event by ID - ORIGINAL SIGNATURE PRESERVED
 * @param req needs req.params.eventid
 */
const getEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield associations_js_1.Event.findOne({
            where: { eventId: req.params.eventid },
            include: [
                {
                    model: associations_js_1.UserEvent,
                    attributes: ['userId', 'isHost', 'isGoing'],
                    include: [
                        {
                            model: associations_js_1.User,
                            attributes: ['name', 'profilePic'],
                        },
                    ],
                },
            ],
        });
        if (!event) {
            return res
                .status(404)
                .json((0, utils_1.resBody)(false, '404', null, 'No event found'));
        }
        res.status(200).json((0, utils_1.resBody)(true, null, event, 'Event fetched'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500).json((0, utils_1.resBody)(false, '500', null, err.message));
    }
});
/**
 * Update event - ORIGINAL SIGNATURE PRESERVED
 * @param req needs req.params.eventid and body with what has changed
 */
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedEvent = yield associations_js_1.Event.update(req.body, {
            where: { eventId: req.params.eventid },
            returning: true,
        });
        res
            .status(200)
            .json((0, utils_1.resBody)(true, null, updatedEvent[1][0], 'Event updated'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500).json((0, utils_1.resBody)(false, '500', null, err.message));
    }
});
/**
 * Delete event - ORIGINAL SIGNATURE PRESERVED
 * @param req needs req.params.eventid
 */
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventExists = yield associations_js_1.Event.findOne({
            where: { eventId: req.params.eventid },
        });
        if (!eventExists) {
            return res
                .status(400)
                .json((0, utils_1.resBody)(false, '400', null, 'Wrong event id'));
        }
        const deletedEvent = yield associations_js_1.Event.destroy({
            where: { eventId: req.params.eventid },
        });
        res.status(200).json((0, utils_1.resBody)(true, null, deletedEvent, 'Event deleted'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(400).json((0, utils_1.resBody)(false, '500', null, err.message));
    }
});
/**
 * Get user events - ORIGINAL SIGNATURE PRESERVED
 * @param req needs req.params.userid
 * Updated: Now includes userId in response and fixes host isGoing status
 */
const getUserEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fix existing host relationships to have isGoing: true (retroactive fix)
        yield associations_js_1.UserEvent.update({ isGoing: true }, {
            where: {
                userId: req.params.userid,
                isHost: true,
                isGoing: false
            }
        });
        const eventIds = yield associations_js_1.UserEvent.findAll({
            where: { userId: req.params.userid },
        });
        if (eventIds.length) {
            const eventsArray = [];
            for (const event of eventIds) {
                eventsArray.push(event.dataValues.eventId);
            }
            const events = yield associations_js_1.Event.findAll({
                where: { eventId: eventsArray },
                include: {
                    model: associations_js_1.UserEvent,
                    where: { userId: req.params.userid },
                    attributes: ['userId', 'isHost', 'isGoing'], // Include userId for filtering
                },
            });
            res.status(200).json((0, utils_1.resBody)(true, null, events, 'User events fetched'));
        }
        else {
            // Return empty array instead of throwing error when user has no events
            res.status(200).json((0, utils_1.resBody)(true, null, [], 'No events found'));
        }
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500).json((0, utils_1.resBody)(false, '500', null, err.message));
    }
});
exports.default = { newEvent, getEvent, updateEvent, deleteEvent, getUserEvents };
