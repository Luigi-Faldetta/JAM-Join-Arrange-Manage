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
const todo_1 = __importDefault(require("../models/todo"));
/**
 * @param req needs body with at least {"title", "isDone", "creatorId", "eventId"}
 */
const newToDo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newTodo = yield todo_1.default.create(req.body);
        res.status(201)
            .json((0, utils_1.resBody)(true, null, newTodo, "Todo created"));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500)
            .json((0, utils_1.resBody)(false, null, null, err.message));
    }
});
/**
 * @param req needs req.params.todoid and body with updated info {"title", "isDone"}
 */
const updateToDo = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedTodo = yield todo_1.default.update(req.body, {
                where: { id: req.params.todoid },
                returning: true
            });
            res.status(200)
                .json((0, utils_1.resBody)(true, null, updatedTodo[1][0], 'Todo updated'));
        }
        catch (err) {
            process.env.NODE_ENV !== 'test' && console.error(err);
            res.status(500)
                .json((0, utils_1.resBody)(false, null, null, err.message));
        }
    });
};
/**
 * @param req needs req.params.todoid
 */
const deleteToDo = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const todoExists = yield todo_1.default.findOne({ where: { id: req.params.todoid } });
            if (!todoExists) {
                return res.status(400)
                    .json((0, utils_1.resBody)(false, '400', null, "Wrong todo id"));
            }
            let todo = yield todo_1.default.destroy({ where: { id: req.params.todoid } });
            res.status(201)
                .json((0, utils_1.resBody)(true, null, todo, "Todo deleted"));
        }
        catch (err) {
            process.env.NODE_ENV !== 'test' && console.error(err);
            res.status(400)
                .json((0, utils_1.resBody)(false, null, null, err.message));
        }
    });
};
/**
 * @param req needs req.params.eventid
 */
const getToDos = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const todos = yield todo_1.default.findAll({ where: { eventId: req.params.eventid } });
            if (todos.length) {
                res.status(200)
                    .json((0, utils_1.resBody)(true, null, todos, 'Expenses fetched'));
            }
            else {
                throw new Error("No todos were found");
            }
        }
        catch (err) {
            process.env.NODE_ENV !== 'test' && console.error(err);
            res.status(500)
                .json((0, utils_1.resBody)(false, null, null, err.message));
        }
    });
};
exports.default = { newToDo, updateToDo, deleteToDo, getToDos };
