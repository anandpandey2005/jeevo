import express from 'express';
import { sendOtp2Email, verifyOtp } from '../controller/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/send-otp', sendOtp2Email);
authRouter.post('/verify-otp', verifyOtp);

export default authRouter;
