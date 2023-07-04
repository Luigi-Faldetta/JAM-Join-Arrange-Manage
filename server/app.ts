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

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
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

  socket.on("joinRoom", (eventId: string) => {
    socket.join(eventId);
    console.log(`User joined room: ${eventId}`);
  });

  socket.on("leaveRoom", (eventId: string) => {
    socket.leave(eventId);
    console.log(`User left room: ${eventId}`);
  });

  socket.on("newMessage", ({
    userId,
    eventId,
    message,
  }: {
    userId: string;
    eventId: string;
    message: string;
  }) => {
    io.to(eventId).emit("newMessage", `${userId} said ${message} in room ${eventId}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});


export { app, server, io };