import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { sendOtp2Email } from './utils/otp.utils.js';
import auditLogger from './middleware/Audit.middleware.js';
const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(auditLogger);
app.post('/', sendOtp2Email);

export default app;
