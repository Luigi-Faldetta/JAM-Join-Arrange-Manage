"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const router_js_1 = __importDefault(require("./router.js"));
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
const sessionOptions = {
    // name: 'sid',
    cookie: {
        httpOnly: false,
        secure: false,
        // sameSite: true,
        maxAge: 1000 * 60 * 60, // 1 hour
    },
    secret: process.env.SECRET || 'hack_me_now',
    // resave: false,
    // saveUninitialized: false,
};
const corsOptions = {
    origin: true,
    credentials: true,
};
app.use((0, express_session_1.default)(sessionOptions));
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(router_js_1.default);
exports.default = app;
