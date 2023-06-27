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
const todo_1 = __importDefault(require("../models/todo"));
//needs req.body {title, isDone, creatorId, eventId}
const postToDo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newtodo = yield todo_1.default.create(Object.assign({}, req.body));
        res.status(201).json({
            success: true,
            data: newtodo,
            message: "newtodo created",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});
// Needs req.params.todoId
// Needs body with info
const updateToDo = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const info = req.body;
            let todo = yield todo_1.default.findByPk(id);
            if (!todo) {
                res.status(404).json({
                    success: false,
                    data: null,
                    message: 'ToDo item not found.',
                });
                return next();
            }
            let todoUpdated = {};
            todoUpdated = yield todo.update(info);
            res.status(200).json({
                success: true,
                data: todoUpdated,
                message: 'ToDo item updated successfully.',
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    });
};
// Needs req.params.todoId*
const deleteToDo = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id)
                res.status(400).json({
                    success: false,
                    data: id,
                    message: "wrong id",
                });
            let todo = yield todo_1.default.destroy({ where: { id: id } });
            res.status(201).json({
                success: true,
                data: todo,
                message: "todo deleted",
            });
        }
        catch (error) {
            console.log(error);
            res.status(400).send(error.message);
        }
    });
};
// Needs req.params.eventId
const getToDos = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const todosIds = yield todo_1.default.findAll({
                where: { eventId: req.params.eventid },
            });
            if (todosIds) {
                const todosArray = [];
                for (const todo of todosIds) {
                    todosArray.push(todo.dataValues.id);
                }
                const todos = yield todo_1.default.findAll({ where: { id: todosArray } });
                res.status(200).json(todos);
            }
            else {
                throw "No todos where found";
            }
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    });
};
exports.default = { postToDo, updateToDo, deleteToDo, getToDos };
