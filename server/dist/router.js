"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./models/modelDB");
const router = express_1.default.Router();
const index_1 = require("./controllers/index");
// User
router.post('/register', index_1.user.postUser);
router.get('/user/:id', index_1.user.getUserInfo);
router.patch('/user/:id', index_1.user.editUser);
router.delete('/user/:id', () => { });
router.get('/users/:eventid', index_1.user.getAllUsers);
// Event
router.post('/newevent', index_1.event.newEvent);
router.get('/event/:id', index_1.event.getEvent);
router.patch('/event/:id', index_1.event.updateEvent);
router.delete('/event/:id', index_1.event.deleteEvent);
router.get('/events/:userid', index_1.event.getUserEvents);
// Todo
router.post('/todo', () => { });
router.patch('/todo/:id', () => { });
router.delete('/todo/:id', () => { });
router.get('/todos/:eventid', () => { });
// Expense
router.post('/expense', index_1.expense.newExpense);
router.delete('/expense/:id', index_1.expense.deleteExpense);
router.get('/expenses/:eventid', index_1.expense.getExpenses);
// Else
router.get('/*', () => { console.log('URL not found'); });
exports.default = router;
