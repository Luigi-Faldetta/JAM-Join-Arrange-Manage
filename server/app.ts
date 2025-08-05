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
const corsOptions = {
  origin: ['http://localhost:3000', process.env.FRONTEND_URL].filter(
    (url): url is string => typeof url === 'string'
  ),
  credentials: true,
};

app.use(cors(corsOptions));
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
