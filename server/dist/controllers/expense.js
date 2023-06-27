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
const expense_1 = __importDefault(require("../models/expense"));
// It works
// {"item": "item", "cost": "20",
// "purchaserId": id, "eventId": id }
const newExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expense = yield expense_1.default.create(req.body);
        res.status(201).json(expense);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
// It works
// /req.params.id*
const deleteExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedExpense = yield expense_1.default.destroy({ where: { id: req.params.id } });
        res.status(201).json(deletedExpense);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
// It works
// /req.params.eventId*
const getExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expenses = yield expense_1.default.findAll({
            where: { eventId: req.params.eventid }
        });
        res.status(201).json(expenses);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
exports.default = { newExpense, deleteExpense, getExpenses };
