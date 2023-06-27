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
    res.send({ health: 'server runnning!!' });
});
// User
router.post('/register', index_1.user.postUser);
router.get('/user/:id', index_1.user.getUserInfo);
router.patch('/user/:id', index_1.user.editUser);
router.delete('/user/:id', index_1.user.deleteUser);
router.get('/users/:eventid', index_1.user.getAllUsers);
// Event
router.post('/newevent', index_1.event.newEvent);
router.get('/event/:eventid', index_1.event.getEvent);
router.patch('/event/:eventid', index_1.event.updateEvent);
router.delete('/event/:eventid', index_1.event.deleteEvent);
router.get('/events/:userid', index_1.event.getUserEvents);
// Todo
router.post('/todo', index_1.todo.postToDo);
router.patch('/todo/:id', index_1.todo.updateToDo);
router.delete('/todo/:id', index_1.todo.deleteToDo);
router.get('/todos/:eventid', index_1.todo.getToDos);
// Expense
router.post('/expense', index_1.expense.newExpense);
router.delete('/expense/:id', index_1.expense.deleteExpense);
router.get('/expenses/:eventid', index_1.expense.getExpenses);
//UserEvents
router.post('/useractivity', index_1.eventActivity.joinEvent);
router.delete('/useractivity', index_1.eventActivity.leaveEvent);
exports.default = router;
