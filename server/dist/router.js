"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
require("./models/modelDB");
const index_1 = require("./controllers/index");
router.get('/health', (_req, res) => {
    res.send({ health: 'Server runnning!! =)' });
});
// User
router.post('/register', index_1.user.newUser);
router.get('/user/:userid', index_1.user.getUser);
router.patch('/user/:userid', index_1.user.updateUser);
router.delete('/user/:userid', index_1.user.deleteUser);
router.get('/users/:eventid', index_1.user.getAllUsers);
// Event
router.post('/newevent/:userid', index_1.event.newEvent);
router.get('/event/:eventid', index_1.event.getEvent);
router.patch('/event/:eventid', index_1.event.updateEvent);
router.delete('/event/:eventid', index_1.event.deleteEvent);
router.get('/events/:userid', index_1.event.getUserEvents);
// Todo
router.post('/todo', index_1.todo.newToDo);
router.patch('/todo/:todoid', index_1.todo.updateToDo);
router.delete('/todo/:todoid', index_1.todo.deleteToDo);
router.get('/todos/:eventid', index_1.todo.getToDos);
// Expense
router.post('/expense', index_1.expense.newExpense);
router.delete('/expense/:expenseid', index_1.expense.deleteExpense);
router.get('/expenses/:eventid', index_1.expense.getExpenses);
// User events
router.post('/useractivity', index_1.userEvent.joinEvent);
router.patch('/useractivity', index_1.userEvent.updateEvent);
router.delete('/useractivity', index_1.userEvent.leaveEvent);
// Session
router.post('/userlogin', index_1.session.logIn);
router.get('/userlogout', index_1.session.logOut);
// Calculations
router.get('/calculate/:eventid', index_1.calculation.splitEqual);
// @ts-ignore
router.get('/test1', (req, res) => { res.send('All good'); });
router.get('/test2', index_1.session.authorize, (req, res) => { res.send('All good'); });
exports.default = router;
