import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import router from './router.js';
import session from 'express-session'

const app = express();

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