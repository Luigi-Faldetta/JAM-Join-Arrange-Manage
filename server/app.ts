import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './router.js';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { addMessageSocket } from './controllers/socketMessages.js';

const app = express();
const server = http.createServer(app);

// Use the same CORS options for both Express and Socket.IO
const allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:3000',
  'https://jam-app.es',
  process.env.FRONTEND_URL
].filter((url): url is string => typeof url === 'string');

console.log('Server starting - Allowed origins:', allowedOrigins);

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

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
  } else {
    next();
  }
});

app.use(express.json());
app.use(cookieParser());
app.use(router);

const io = new Server(server, { cors: corsOptions });

io.on('connection', (socket: Socket) => {
  socket.on('joinRoom', (info: { eventId: string; userId: string }) => {
    socket.join(info.eventId);
    console.log(`User ${info.userId} joined room: ${info.eventId}`);
  });

  socket.on('leaveRoom', (eventId: string) => {
    socket.leave(eventId);
  });

  socket.on(
    'newMessage',
    async ({
      userId,
      eventId,
      message,
    }: {
      userId: string;
      eventId: string;
      message: string;
    }) => {
      const msgCreated = await addMessageSocket({
        message,
        userId,
        eventId,
      });
      io.to(eventId).emit('newMessage', msgCreated);
    }
  );

  socket.on('disconnect', () => {});
});

export { app, server, io };
