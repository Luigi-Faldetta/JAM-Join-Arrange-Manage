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
exports.io = exports.server = exports.app = void 0;
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
// Use the same CORS options for both Express and Socket.IO
const allowedOrigins = [
    'http://localhost:3000',
    'https://localhost:3000',
    'https://jam-app.es',
    'https://www.jam-app.es',
    process.env.FRONTEND_URL
].filter((url) => typeof url === 'string' && url.length > 0);
console.log('Server starting - Allowed origins:', allowedOrigins);
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g., mobile apps, Postman)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            console.log('CORS blocked origin:', origin);
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
// Test endpoint to verify server is running
app.get('/test-cors', (req, res) => {
    res.json({
        message: 'CORS test successful',
        origin: req.headers.origin,
        allowedOrigins
    });
});
// Remove trailing slashes from all routes
app.use((req, res, next) => {
    if (req.path.length > 1 && req.path.endsWith('/')) {
        const newPath = req.path.slice(0, -1);
        const query = req.url.slice(req.path.length);
        res.redirect(301, newPath + query);
    }
    else {
        next();
    }
});
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(router_js_1.default);
const io = new socket_io_1.Server(server, { cors: corsOptions });
exports.io = io;
io.on('connection', (socket) => {
    socket.on('joinRoom', (info) => {
        socket.join(info.eventId);
        console.log(`User ${info.userId} joined room: ${info.eventId}`);
    });
    socket.on('leaveRoom', (eventId) => {
        socket.leave(eventId);
    });
    socket.on('newMessage', ({ userId, eventId, message, }) => __awaiter(void 0, void 0, void 0, function* () {
        const msgCreated = yield (0, socketMessages_js_1.addMessageSocket)({
            message,
            userId,
            eventId,
        });
        io.to(eventId).emit('newMessage', msgCreated);
    }));
    socket.on('disconnect', () => { });
});
