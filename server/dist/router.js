"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./models/modelDB");
const router = express_1.default.Router();
// User
router.post('/register', () => { });
router.get('/user/:id', () => { });
router.patch('/user/:id', () => { });
router.delete('/user/:id', () => { });
router.get('/users/:eventid', () => { });
// Event
router.post('/newevent', () => { });
router.get('/event/:id', () => { });
router.patch('/event/:id', () => { });
router.delete('/event/:id', () => { });
router.get('/events/:userid', () => { });
// Todo
router.post('/todo', () => { });
router.patch('/todo/:id', () => { });
router.delete('/todo/:id', () => { });
router.get('/todos/:eventid', () => { });
// Expense
router.post('/expense', () => { });
router.delete('/expense/:id', () => { });
router.get('/expenses/:eventid', () => { });
// Else
router.get('/*', () => { console.log('Not found'); });
exports.default = router;
