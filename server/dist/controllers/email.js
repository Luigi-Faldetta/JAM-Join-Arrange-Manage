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
const uuid_1 = require("uuid");
const associations_1 = require("../models/associations");
const utils_1 = require("../utils");
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.JAM_EMAIL,
        pass: process.env.JAM_PW,
    },
});
function sendEmail(user, pw) {
    return __awaiter(this, void 0, void 0, function* () {
        const mailOptions = {
            from: `"J.A.M. - IT Department" <${process.env.JAM_EMAIL}>`,
            to: user.email,
            subject: `Password reset requested`,
            html: `<p>Hi ${user.name}, here you can find your new temporary password:</p><code style="border:1px solid lightgrey; padding: 5px">${pw}</code><p>Please <a href="https://youtu.be/dQw4w9WgXcQ">log in now</a> and update it</p><p>J.A.M.</p>`,
        };
        try {
            yield transporter.sendMail(mailOptions, function (error, info) {
                if (!error) {
                    console.log('Email sent: ' + info.response);
                }
                else {
                    console.log(error);
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.email) {
            return res.status(400)
                .json((0, utils_1.resBody)(false, "400", null, "Missing input email"));
        }
        const user = yield associations_1.User.findOne({
            where: { email: req.params.email }
        });
        if (!user) {
            return res.status(400)
                .json((0, utils_1.resBody)(false, "400", null, "Something went wrong..."));
        }
        const newPassword = (0, uuid_1.v4)().slice(0, 8);
        const hash = yield bcrypt_1.default.hash(newPassword, 10);
        yield associations_1.User.update(Object.assign(Object.assign({}, user), { password: hash }), { where: { email: req.params.email } });
        yield sendEmail(user, newPassword);
        res.status(201)
            .json({
            success: true,
            error: null,
            data: null,
            message: 'Email with temporary password sent',
        });
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500)
            .json({ message: err.message });
    }
});
exports.default = { resetPassword };
