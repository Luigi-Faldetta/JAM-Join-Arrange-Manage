"use strict";
// import 'dotenv/config'
// import express from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import router from './router.js';
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
exports.io = exports.server = exports.app = void 0;
// const app = express();
// const corsOptions = {
//   origin: true,
//   credentials: true,
// }
// app.use(cors(corsOptions))
// app.use(express.json());
// app.use(cookieParser());
// app.use(router);
// export default app;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const router_js_1 = __importDefault(require("./router.js"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socketMessages_js_1 = require("./controllers/socketMessages.js");
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: true,
        credentials: true,
    },
});
exports.io = io;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(router_js_1.default);
io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("joinRoom", (info) => {
        socket.join(info.eventId);
        console.log(`User ${info.userId} joined room: ${info.eventId}`);
    });
    socket.on("leaveRoom", (eventId) => {
        socket.leave(eventId);
        console.log(`User left room: ${eventId}`);
    });
    socket.on("newMessage", ({ userId, eventId, message, }) => __awaiter(void 0, void 0, void 0, function* () {
        // save msg to database, then send back he message
        const msgCreated = yield (0, socketMessages_js_1.addMessageSocket)({
            message,
            userId,
            eventId
        });
        console.log(`msg creaed : `, msgCreated);
        io.to(eventId).emit("newMessage", msgCreated);
    }));
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});
