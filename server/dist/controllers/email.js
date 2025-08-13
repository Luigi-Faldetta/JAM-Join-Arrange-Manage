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
        // Check if email credentials are configured
        if (!process.env.JAM_EMAIL || !process.env.JAM_PW) {
            throw new Error('Email credentials not configured. Please set JAM_EMAIL and JAM_PW environment variables.');
        }
        const mailOptions = {
            from: `"JAM - IT Department" <${process.env.JAM_EMAIL}>`,
            to: user.email,
            subject: `Password reset requested`,
            html: `<p>Hi ${user.name}, here you can find your new temporary password:</p><code style="border:1px solid lightgrey; padding: 5px">${pw}</code><p>Please <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}">log in now</a> and update it</p><p>JAM</p>`,
        };
        try {
            const info = yield transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
            return info;
        }
        catch (error) {
            console.error('Failed to send email:', error);
            throw error;
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
        process.env.NODE_ENV !== 'test' && console.error('Password reset error:', err);
        // Return appropriate error message
        if (err.message && err.message.includes('Email credentials not configured')) {
            res.status(500)
                .json((0, utils_1.resBody)(false, "500", null, "Email service not configured. Please contact support."));
        }
        else {
            res.status(500)
                .json((0, utils_1.resBody)(false, "500", null, "Failed to send password reset email. Please try again later."));
        }
    }
});
exports.default = { resetPassword };
