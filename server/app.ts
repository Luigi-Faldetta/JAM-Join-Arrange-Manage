import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './router.js';

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());
app.use(router);

export default app;