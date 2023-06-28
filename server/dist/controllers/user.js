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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.editUser = void 0;
const associations_1 = require("../models/associations");
// Needs body with at least {"name", "email", "password"}
const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(409)
            .send({ error: "409", message: "Missing input data" });
    }
    const user = yield associations_1.User.findOne({ where: { email } });
    if (user)
        return res.status(409)
            .send({ error: "409", message: "User already exists" });
    try {
        const user = yield associations_1.User.create(req.body);
        // @ts-ignore
        const _a = Object.assign({}, user.dataValues), { password } = _a, safeUser = __rest(_a, ["password"]);
        res.status(201).json({
            success: true,
            data: safeUser,
            message: "User created",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
// Needs req.params.userid
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield associations_1.User.findOne({
            where: { userId: req.params.userid }
        });
        // if (!user) {
        //   return res.status(409).send({ error: "409", message: "No user found" })
        // }
        // @ts-ignore
        const _b = Object.assign({}, user.dataValues), { password } = _b, safeUser = __rest(_b, ["password"]);
        res.status(200).json({
            success: true,
            data: safeUser,
            message: "User fetched",
        });
    }
    catch (err) {
        console.error(err);
        res.status(400).send({ error: "400", message: "Bad user request" });
    }
});
<<<<<<< HEAD
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
                usersArray.push(user.dataValues.userId);
            }
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
=======
// Needs req.params.userid
// Needs body with info
>>>>>>> 4e9092a317cf45a21dbf7e96bbf9f07bde05e3a7
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.userid;
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
        res.status(200).json({
            success: true,
            data: userUpdated,
            message: "User updated",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
exports.editUser = editUser;
// Needs req.params.userid
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUser = yield associations_1.User.destroy({ where: { userId: req.params.userid } });
        res.status(200).json({
            success: true,
            data: deletedUser,
            message: 'User deleted',
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ error: "400", message: "Bad user request" });
    }
});
exports.deleteUser = deleteUser;
// Needs req.params.eventid
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userIds = yield associations_1.UserEvents.findAll({
            where: { eventId: req.params.eventid },
        });
        // console.log(userIds)
        if (userIds) {
            const usersArray = [];
            for (const user of userIds) {
                usersArray.push(user.dataValues.userId);
            }
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
exports.default = { newUser, getUser, editUser: exports.editUser, deleteUser: exports.deleteUser, getAllUsers };
