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
const associations_1 = require("../models/associations");
const constants_js_1 = require("../constants.js");
const utils_1 = require("../utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * @param req needs body with at least {"email", "password"}
 */
const logIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json((0, utils_1.resBody)(false, '400', null, 'Missing input data'));
    }
    try {
        const user = yield associations_1.User.findOne({ where: { email: req.body.email } });
        if (!user)
            throw new Error('Incorrect email/password');
        const validatedPass = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (!validatedPass)
            throw new Error('Incorrect email/password');
        const token = jsonwebtoken_1.default.sign({ userId: user.userId }, process.env.JWT_SECRET || process.env.TOKEN_SECRET, { expiresIn: '2h' });
        res.cookie('jwt', token, {
            httpOnly: false,
            secure: constants_js_1.__prod__,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 2, // 2h
        });
        res
            .status(200)
            .json((0, utils_1.resBody)(true, null, token, 'Logged in successfully'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.log(err);
        res.status(401).json((0, utils_1.resBody)(false, null, null, err.message));
    }
});
/**
 * Needs nothing, it destroys the cookie
 */
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie('jwt', '', {
            httpOnly: false,
            expires: new Date(0),
        });
        res.status(200).json((0, utils_1.resBody)(true, null, null, 'Logged out successfully'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.log(err);
        res.status(500).json((0, utils_1.resBody)(false, null, null, err.message));
    }
});
/**
 * Needs nothing, it checks the cookie
 */
const authorize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res
            .status(401)
            .json((0, utils_1.resBody)(false, '401', null, 'Token is not present'));
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || process.env.TOKEN_SECRET, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            if (err.name === 'TokenExpiredError') {
                return res
                    .status(401)
                    .json((0, utils_1.resBody)(false, '401', null, 'Session expired, please log in again.'));
            }
            return res
                .status(403)
                .json((0, utils_1.resBody)(false, '403', null, 'Some error happened during the token verification'));
        }
        // @ts-ignore
        const user = yield associations_1.User.findByPk(payload === null || payload === void 0 ? void 0 : payload.userId);
        if (!user) {
            return res
                .status(403)
                .json((0, utils_1.resBody)(false, '403', null, 'Some error happened during the user verification'));
        }
        const _a = Object.assign({}, user.dataValues), { password } = _a, safeUser = __rest(_a, ["password"]);
        // @ts-ignore
        req.user = safeUser;
        return next();
    }));
});
/**
 * @param req body (user) is passed automatically from authorize()
 */
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        // Debug logging
        console.log('=== GET USER INFO DEBUG ===');
        console.log('User object:', JSON.stringify(user, null, 2));
        console.log('User name:', user === null || user === void 0 ? void 0 : user.name);
        console.log('User email:', user === null || user === void 0 ? void 0 : user.email);
        console.log('===========================');
        res
            .status(200)
            .json((0, utils_1.resBody)(true, null, user, 'User is logged'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.log(err);
        res.status(500).json((0, utils_1.resBody)(false, null, null, err.message));
    }
});
exports.default = { logIn, logOut, authorize, getUserInfo };
