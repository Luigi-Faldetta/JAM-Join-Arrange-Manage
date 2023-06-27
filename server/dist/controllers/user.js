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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.editUser = void 0;
const associations_1 = require("../models/associations");
// Needs body like {"name": "email", "password"}
const postUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email)
        return res
            .status(409)
            .send({ error: "409", message: "Missing input email" });
    if (!req.body.password)
        return res
            .status(409)
            .send({ error: "409", message: "Missing input password" });
    const { password, email } = req.body;
    const user = yield associations_1.User.findOne({ where: { email: email } });
    if (user)
        return res
            .status(409)
            .send({ error: "409", message: "User already exists" });
    try {
        const user = yield associations_1.User.create(Object.assign({}, req.body));
        //TODO:we need to send back "safe user" instead of sending the user object
        res.status(201).json({
            success: true,
            data: user,
            message: "User created",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
// Needs req.params.userId*
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    try {
        let user = yield associations_1.User.findOne({ where: { userId: req.params.id } });
        if (user) {
            //TODO:we need to send back "safe user" instead of sending the user object
            res.status(200).json(user);
        }
    }
    catch (err) {
        console.error(err);
        res.status(400).send({ error: "400", message: "Bad user request" });
    }
});
// Needs req.params.eventId*
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userIds = yield associations_1.UserEvents.findAll({
            where: { eventId: req.params.eventid },
        });
        // console.log(userIds)
        if (userIds) {
            const usersArray = [];
            for (const user of userIds) {
                console.log(user.dataValues);
                console.log(user.dataValues.userId);
                usersArray.push(user.dataValues.userId);
            }
            console.log(usersArray);
            const users = yield associations_1.User.findAll({ where: { userId: usersArray } });
            res.status(200).json(users);
        }
        else {
            throw "No users where found";
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
// Needs req.params.userId*
//needs body with info
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const info = req.body;
    try {
        const user = yield associations_1.User.findByPk(id);
        if (!user) {
            res.status(404).json({
                success: false,
                data: null,
                message: "User not found.",
            });
            return;
        }
        let userUpdated = {};
        if (info.password) {
            userUpdated = yield user.update(Object.assign({}, info));
        }
        else {
            userUpdated = yield user.update(info);
        }
        res.status(200).json(userUpdated);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
exports.editUser = editUser;
// Needs req.params.userId*
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id)
            res.status(400).json({
                success: false,
                data: id,
                message: "wrong id",
            });
        let user = yield associations_1.User.destroy({ where: { id: id } });
        res.json(user);
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});
exports.deleteUser = deleteUser;
exports.default = { postUser, getUserInfo, editUser: exports.editUser, getAllUsers, deleteUser: exports.deleteUser };
