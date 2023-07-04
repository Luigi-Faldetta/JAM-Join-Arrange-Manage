// import 'dotenv/config'
// import express from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import router from './router.js';

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
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(router);

io.on("connection", (socket: Socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (info: { eventId: string, userId: string}) => {
    socket.join(info.eventId);
    console.log(`User ${info.userId} joined room: ${info.eventId}`);
  });

  socket.on("leaveRoom", (eventId: string) => {
    socket.leave(eventId);
    console.log(`User left room: ${eventId}`);
  });

  socket.on("newMessage", async ({
    userId,
    eventId,
    message,
  }: {
    userId: string;
    eventId: string;
    message: string;
  }) => {
    // save msg to database, then send back he message
    const msgCreated = await addMessageSocket({
      message,
      userId,
      eventId
    })
    io.to(eventId).emit("newMessage", msgCreated);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});


export { app, server, io };