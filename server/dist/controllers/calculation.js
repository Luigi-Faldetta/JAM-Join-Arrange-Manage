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
const user_1 = __importDefault(require("../models/user"));
const userEvent_1 = __importDefault(require("../models/userEvent"));
const expenseSheet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /**
         * gets a list of expenses associated with the event.
         */
        const expenseList = yield expense_1.default.findAll({ where: { eventId: req.params.eventid } });
        /**
         * gets an array of user id's
         */
        const userEventAssociations = yield userEvent_1.default.findAll({
            where: { eventId: req.params.eventid }
        });
        const userIds = userEventAssociations.map(association => association.userId);
        /**
         * takes the array of user Id's to find the users themselves, we need these for their names.
         */
        const userList = yield user_1.default.findAll({
            where: { userId: userIds }
        });
        /**
         * calculate total of all expenses
         */
        const totalExpenses = expenseList.reduce((total, expense) => total += expense.cost, 0);
        /**
         * calculate how much each individual owes of the total
         * this will be changed with a future update to be calculated based on whether the person is included in the
         * future "splitBetween" property that will be on individual expenses.
         */
        const perPerson = Math.round((totalExpenses / userList.length) * 100) / 100;
        //gets a list of the total expenses paid for by each individual
        let indExpenses = [];
        userList.forEach(user => {
            const myExpenses = expenseList.filter(expense => expense.purchaserId == user.userId);
            const myTotalSpent = myExpenses.reduce((total, expense) => total += expense.cost, 0);
            //cleaner way to do this for sure.
            indExpenses.push({ name: user.name, owes: Math.round((perPerson - myTotalSpent) * 100) / 100 });
        });
        res.status(200).json({
            expenses: expenseList,
            attendees: userList,
            total: totalExpenses,
            perPerson,
            indExpenses,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = { expenseSheet };
