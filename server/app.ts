import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./router.js";
import http from "http";
import { Server, Socket } from "socket.io";
import { addMessageSocket } from "./controllers/socketMessages.js";

const app = express();
const server = http.createServer(app);

const corsOptions = { origin: true, credentials: true };
const io = new Server(server, { cors: corsOptions });

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(router);

io.on("connection", (socket: Socket) => {
  socket.on("joinRoom", (info: { eventId: string; userId: string }) => {
    socket.join(info.eventId);
    console.log(`User ${info.userId} joined room: ${info.eventId}`);
  });

  socket.on("leaveRoom", (eventId: string) => {
    socket.leave(eventId);
  });

  socket.on(
    "newMessage",
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
      io.to(eventId).emit("newMessage", msgCreated);
    }
  );

  socket.on("disconnect", () => {});
});

export { app, server, io };
