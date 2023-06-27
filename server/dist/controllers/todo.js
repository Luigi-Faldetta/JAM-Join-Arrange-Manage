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
const postToDo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, isDone, creatorId, eventId } = req.body;
        const newtodo = yield todo_1.default.create({ title, isDone, creatorId, eventId });
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
const getToDo = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let todos = yield todo_1.default.findAll({ where: { id: req.params.id } });
            if (!todos) {
                res.status(404).json({
                    success: false,
                    data: null,
                    message: "Activities not found.",
                });
                return next();
            }
            res.status(200).json(todos);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    });
};
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
            // todo.title = title || todo.title;
            // todo.creatorId = creatorId || todo.creatorId;
            // todo.eventId = eventId || todo.eventId
            // todo.isDone = isDone ?? todo.isDone;
            // await todo.save();
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
exports.default = { postToDo, getToDo, deleteToDo, updateToDo };
