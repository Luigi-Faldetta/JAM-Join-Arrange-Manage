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
const userEvent_1 = __importDefault(require("../models/userEvent"));
const joinEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userEvent_1.default.create(req.body);
        res.status(201)
            .json({
            success: true,
            error: null,
            data: null,
            message: 'User joined the activity.',
        });
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.log(err);
        res.status(500)
            .json({ message: err.message });
    }
});
const leaveEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userEvent_1.default.destroy({
            where: req.body,
        });
        res.status(200)
            .json({
            success: true,
            error: null,
            data: null,
            message: 'User left the activity.',
        });
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.log(err);
        res.status(400)
            .json({ message: err.message });
    }
});
exports.default = { joinEvent, leaveEvent };
