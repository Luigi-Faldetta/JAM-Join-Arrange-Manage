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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.editUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const associations_1 = require("../models/associations");
// Needs body with at least {"name", "email", "password"}
const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(409)
            .json({
            success: false,
            error: "409",
            data: null,
            message: "Missing input data"
        });
    }
    const user = yield associations_1.User.findOne({ where: { email } });
    if (user)
        return res.status(409)
            .json({
            success: false,
            error: "409",
            data: null,
            message: "User already exists"
        });
    const inputPassword = password;
    try {
        const hash = yield bcrypt_1.default.hash(inputPassword, 10);
        const user = yield associations_1.User.create(Object.assign(Object.assign({}, req.body), { password: hash }));
        // @ts-ignore
        const _a = Object.assign({}, user.dataValues), { password } = _a, safeUser = __rest(_a, ["password"]);
        res.status(201)
            .json({
            success: true,
            error: null,
            data: safeUser,
            message: "User created",
        });
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500)
            .json({ message: err.message });
    }
});
// Needs req.params.userid
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield associations_1.User.findOne({
            where: { userId: req.params.userid }
        });
        if (!user) {
            return res.status(404)
                .json({
                success: false,
                error: "404",
                data: null,
                message: "No user found"
            });
        }
        // @ts-ignore
        const _b = Object.assign({}, user.dataValues), { password } = _b, safeUser = __rest(_b, ["password"]);
        res.status(200)
            .json({
            success: true,
            error: null,
            data: safeUser,
            message: "User fetched",
        });
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(400)
            .json({ message: err.message });
    }
});
// Needs req.params.userid
// Needs body with the changes 
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let updatedUser = {};
        if (req.body.password) {
            const hash = yield bcrypt_1.default.hash(req.body.password, 10);
            updatedUser = yield associations_1.User.update(Object.assign(Object.assign({}, req.body), { password: hash }), { where: { userId: req.params.userid }, returning: true });
        }
        else {
            updatedUser = yield associations_1.User.update(req.body, { where: { userId: req.params.userid }, returning: true });
        }
        // @ts-ignore
        const _c = Object.assign({}, updatedUser[1][0].dataValues), { password } = _c, safeUpdatedUser = __rest(_c, ["password"]);
        res.status(200)
            .json({
            success: true,
            error: null,
            data: safeUpdatedUser,
            message: "User updated",
        });
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500)
            .json({ message: err.message });
    }
});
exports.editUser = editUser;
// Needs req.params.userid
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUser = yield associations_1.User.destroy({ where: { userId: req.params.userid } });
        res.status(200)
            .json({
            success: true,
            error: null,
            data: deletedUser,
            message: 'User deleted',
        });
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(400)
            .json({ message: err.message });
    }
});
exports.deleteUser = deleteUser;
// Needs req.params.eventid
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userIds = yield associations_1.UserEvents.findAll({
            where: { eventId: req.params.eventid }
        });
        if (userIds.length) {
            const usersArray = [];
            for (const user of userIds) {
                usersArray.push(user.dataValues.userId);
            }
            const users = yield associations_1.User.findAll({ where: { userId: usersArray } });
            res.status(200)
                .json({
                success: true,
                error: null,
                data: users,
                message: 'Event users fetched',
            });
        }
        else {
            throw new Error("No users where found");
        }
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500)
            .json({ message: err.message });
    }
});
exports.default = { newUser, getUser, editUser: exports.editUser, deleteUser: exports.deleteUser, getAllUsers };
