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
const expense_1 = __importDefault(require("../models/expense"));
// Needs body with {"item", "cost", "purchaserId", "eventId" }
const newExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expense = yield expense_1.default.create(req.body);
        res.status(201)
            .json((0, utils_1.resBody)(true, null, expense, 'Expense created'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500)
            .json((0, utils_1.resBody)(false, null, null, err.message));
    }
});
// Needs req.params.expenseid
const deleteExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedExpense = yield expense_1.default.destroy({ where: { id: req.params.expenseid } });
        res.status(201)
            .json((0, utils_1.resBody)(true, null, deletedExpense, 'Expense deleted'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500)
            .json((0, utils_1.resBody)(false, null, null, err.message));
    }
});
// Needs req.params.eventid
const getExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expenses = yield expense_1.default.findAll({ where: { eventId: req.params.eventid } });
        if (expenses.length) {
            res.status(200)
                .json((0, utils_1.resBody)(true, null, expenses, 'Expenses fetched'));
        }
        else {
            throw new Error("No expenses were found");
        }
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500)
            .json((0, utils_1.resBody)(false, null, null, err.message));
    }
});
exports.default = { newExpense, deleteExpense, getExpenses };
