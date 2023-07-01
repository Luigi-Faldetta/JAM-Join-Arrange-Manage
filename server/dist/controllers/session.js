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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const associations_1 = require("../models/associations");
//@ts-ignore
const resBody = (success, error, data, message) => { return { success, error, data, message }; };
// Needs body with {"email", "password"} 
const logIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.password) {
        return res.status(400)
            .json(resBody(false, "400", null, "Missing input data"));
    }
    try {
        const user = yield associations_1.User.findOne({ where: { email: req.body.email } });
        if (!user)
            throw new Error('Incorrect email/password');
        // @ts-ignore
        const validatedPass = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (!validatedPass)
            throw new Error('Incorrect email/password');
        // @ts-ignore
        const token = jsonwebtoken_1.default.sign({ userId: user.userId }, process.env.TOKEN_SECRET, { expiresIn: '30d' });
        res.cookie('jwt', token, {
            httpOnly: false,
            secure: false,
            // secure: __prod__,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 30 // 30d
        });
        res.status(200)
            // @ts-ignore
            .json(resBody(true, null, user.userId, 'Logged in successfully'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.log(err);
        res.status(401)
            .json(resBody(false, null, null, err.message));
    }
});
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie('jwt', '', {
            httpOnly: false,
            expires: new Date(0)
        });
        res.status(200)
            .json(resBody(true, null, null, 'Logged out successfully'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.log(err);
        res.status(500)
            .json(resBody(false, null, null, err.message));
    }
});
const authorize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401)
            .json(resBody(false, "401", null, 'Token is not present'));
    }
    // @ts-ignore
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return res.status(403)
                .json(resBody(false, "403", null, 'Some error happenedd during the token verification 1'));
        }
        // @ts-ignore
        const user = yield associations_1.User.findByPk(payload.userId);
        if (!user) {
            return res.status(403)
                .json(resBody(false, "403", null, 'Some error happenedd during the token verification 2'));
        }
        console.log('Success, user verified');
        // @ts-ignore
        req.userId = user.userId;
        return next();
    }));
});
exports.default = { logIn, logOut, authorize };
