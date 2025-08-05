"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
require("./models/modelDB.js");
const index_js_1 = require("./controllers/index.js");
// Health check - keeping your original format
router.get('/health', (_req, res) => {
    res.send({ health: 'Server runnning!! =)' });
});
// ============================================================================
// USER ROUTES - EXACTLY AS ORIGINAL
// ============================================================================
router.post('/register', index_js_1.user.newUser);
router.get('/user/:userid', index_js_1.user.getUser);
router.patch('/user/:userid', index_js_1.user.updateUser);
router.delete('/user/:userid', index_js_1.user.deleteUser);
router.get('/users/:eventid', index_js_1.user.getAllUsers);
// ============================================================================
// EVENT ROUTES - EXACTLY AS ORIGINAL
// ============================================================================
router.post('/newevent/:userid', index_js_1.event.newEvent); // RESTORED ORIGINAL
router.get('/event/:eventid', index_js_1.event.getEvent);
router.patch('/event/:eventid', index_js_1.event.updateEvent);
router.delete('/event/:eventid', index_js_1.event.deleteEvent);
router.get('/events/:userid', index_js_1.event.getUserEvents); // RESTORED ORIGINAL
// ============================================================================
// TODO ROUTES - EXACTLY AS ORIGINAL
// ============================================================================
router.post('/todo', index_js_1.todo.newToDo);
router.patch('/todo/:todoid', index_js_1.todo.updateToDo);
router.delete('/todo/:todoid', index_js_1.todo.deleteToDo);
router.get('/todos/:eventid', index_js_1.todo.getToDos);
// ============================================================================
// EXPENSE ROUTES - EXACTLY AS ORIGINAL
// ============================================================================
router.post('/expense', index_js_1.expense.newExpense);
router.delete('/expense/:expenseid', index_js_1.expense.deleteExpense);
router.get('/expenses/:eventid', index_js_1.expense.getExpenses);
// ============================================================================
// USER EVENT ROUTES - EXACTLY AS ORIGINAL
// ============================================================================
router.post('/useractivity', index_js_1.userEvent.joinEvent);
router.patch('/useractivity', index_js_1.userEvent.updateEvent);
router.delete('/useractivity', index_js_1.userEvent.leaveEvent);
// ============================================================================
// SESSION ROUTES - EXACTLY AS ORIGINAL
// ============================================================================
router.post('/userlogin', index_js_1.session.logIn);
router.get('/userlogout', index_js_1.session.logOut);
router.get('/me', index_js_1.session.authorize, index_js_1.session.getUserInfo);
// ============================================================================
// CALCULATION ROUTES - EXACTLY AS ORIGINAL
// ============================================================================
router.get('/calculate/:eventid', index_js_1.calculation.expenseSheet);
// ============================================================================
// CHAT ROUTES - EXACTLY AS ORIGINAL
// ============================================================================
router.get('/chat/:eventid', index_js_1.eventChat.getChat);
router.post('/chat/', index_js_1.eventChat.newMessage);
// ============================================================================
// EMAIL ROUTES - EXACTLY AS ORIGINAL
// ============================================================================
router.get('/passwordreset/:email', index_js_1.email.resetPassword);
exports.default = router;
