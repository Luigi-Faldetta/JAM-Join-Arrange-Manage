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
const utils_1 = require("../utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Sync a Clerk user with the backend database
 * Creates a new user if they don't exist, or returns existing user
 * @param req needs body with Clerk user data: { clerkId, email, name, profilePic? }
 */
const syncClerkUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clerkId, email, name, profilePic } = req.body;
    if (!clerkId || !email || !name) {
        return res
            .status(400)
            .json((0, utils_1.resBody)(false, '400', null, 'Missing required user data'));
    }
    try {
        // Check if user already exists by email
        let user = yield associations_1.User.findOne({ where: { email } });
        if (!user) {
            // Create new user for Clerk OAuth users
            // Use clerkId as password (it won't be used for login)
            user = yield associations_1.User.create({
                name,
                email,
                password: clerkId,
                phone: '',
                profilePic: profilePic || '',
            });
        }
        // Generate JWT token for the user
        const token = jsonwebtoken_1.default.sign({ userId: user.userId }, process.env.JWT_SECRET || process.env.TOKEN_SECRET, { expiresIn: '2h' });
        const _a = Object.assign({}, user.dataValues), { password } = _a, safeUser = __rest(_a, ["password"]);
        res.status(200).json({
            success: true,
            data: {
                user: safeUser,
                token,
            },
            message: 'User synced successfully',
        });
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error('Clerk sync error:', err);
        res.status(500).json((0, utils_1.resBody)(false, '500', null, err.message));
    }
});
exports.default = { syncClerkUser };
