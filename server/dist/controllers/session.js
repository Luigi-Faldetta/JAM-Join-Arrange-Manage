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
const associations_1 = require("../models/associations");
// Needs body with {"email", "password"} 
const logIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.password) {
        return res.status(400)
            .json({
            success: false,
            error: "400",
            data: null,
            message: "Missing input data"
        });
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
        req.session.uid = user.userId;
        res.status(200)
            .json({
            success: true,
            error: null,
            // @ts-ignore
            data: user.userId,
            message: 'Logged in successfully'
        });
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.log(err);
        res.status(401)
            .json({ message: err.message });
    }
});
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.destroy((error) => {
        if (error) {
            res.status(500)
                .json({ error, message: 'Log out went wrong' });
        }
        else {
            res.clearCookie('sid')
                .status(200)
                .json({
                success: false,
                error: null,
                data: null,
                message: 'Logged out successfully'
            });
        }
    });
});
exports.default = { logIn, logOut };
