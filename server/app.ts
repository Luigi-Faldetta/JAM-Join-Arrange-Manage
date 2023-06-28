import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import session from 'express-session'
import router from './router.js';
import { __prod__ } from './constants.js';

const app = express();

const sessionOptions: session.SessionOptions = {
  name: 'sid',
  cookie: {
    httpOnly: false,
    secure: __prod__,
    sameSite: true,
    maxAge: 1000 * 60 * 60, // 1 hour
  },
  secret: process.env.SECRET || 'hack_me_now',
  resave: false,
  saveUninitialized: false,
}

const corsOptions = {
  origin: true,
  credentials: true,
}

app.use(session(sessionOptions));
app.use(cors(corsOptions))
app.use(express.json());
app.use(router);

export default app;