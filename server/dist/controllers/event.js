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
// It works
const newEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield associations_1.Event.create(req.body);
        res.status(201).json(event);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
// It works
const getEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield associations_1.Event.findOne({
            where: { eventId: req.params.id }
        });
        res.status(200).json(event);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
// It works
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedEvent = yield associations_1.Event.update(req.body, { where: { eventId: req.params.id }, returning: true });
        res.status(200).json(updatedEvent);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
// It works
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedEvent = yield associations_1.Event.destroy({ where: { eventId: req.params.id } });
        res.status(200).json(deletedEvent);
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});
const getUserEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield associations_1.Event.findAll({
            where: { host: req.params.id }
        });
        res.status(200).json(events);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
exports.default = { newEvent, getEvent, updateEvent, deleteEvent, getUserEvents };
