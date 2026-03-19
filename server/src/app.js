import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import auditLogger from './middleware/Audit.middleware.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
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
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/dashboard', userRouter);

export default app;
