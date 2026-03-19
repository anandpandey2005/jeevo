import nodemailer from 'nodemailer';
import { User } from '../models/User.models.js';
import { createToken } from '../utils/jwt/createToken.jwt.utils.js';

const normalizeEmail = (value = '') =>
  String(value || '')
    .trim()
    .toLowerCase();

const normalizeRole = (value = '') => {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) return null;
  const allowed = new Set(['donor', 'hero', 'user', 'admin', 'hospital']);
  return allowed.has(normalized) ? normalized : null;
};

const makeOtp = async (email, role) => {
  try {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
      throw new Error('Email is required');
    }

    const normalizedRole = normalizeRole(role);
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.findOneAndUpdate(
      { gmail: normalizedEmail },
      {
        $set: { otp, otpExpiry },
        $setOnInsert: {
          gmail: normalizedEmail,
          ...(normalizedRole ? { role: normalizedRole } : {}),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return { user, otp };
  } catch (err) {
    console.error('Error in makeOtp:', err.message);
    throw new Error('Failed to generate OTP');
  }
};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILAPPPASSWORD,
  },
});

const sendOtp2Email = async (req, res) => {
  try {
    const { email, gmail, role } = req?.body || {};
    const userEmail = normalizeEmail(email || gmail);

    if (!userEmail) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const { user, otp } = await makeOtp(userEmail, role);
    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: 'Failed to create user' });
    }

    const mailOptions = {
      from: `Jeevo <${process.env.EMAIL}>`,
      to: userEmail,
      subject: `${otp} is your Jeevo verification code`,
      text: `Your Jeevo OTP is ${otp}. It expires in 10 minutes. Locate. Donate. Celebrate.`,
      html: `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 16px; overflow: hidden;">
      <div style="background-color: #dc2626; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: -1px; font-weight: 900; font-style: italic;">JEEVO</h1>
        <p style="color: #fee2e2; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; tracking: 2px;">Locate • Donate • Celebrate</p>
      </div>

      <div style="padding: 40px; background-color: #ffffff; text-align: center;">
        <h2 style="color: #1e293b; margin-bottom: 10px;">Verify Your Identity</h2>
        <p style="color: #64748b; font-size: 16px; margin-bottom: 30px;">Thank you for joining the mission to save lives. Use the code below to complete your verification.</p>
        
        <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; padding: 20px; border-radius: 12px; display: inline-block;">
          <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #dc2626;">${otp}</span>
        </div>
        
        <p style="color: #94a3b8; font-size: 14px; margin-top: 30px;">
          This code will expire in <b>10 minutes</b>. <br/>
          If you didn't request this, please ignore this email.
        </p>
      </div>

      <div style="padding: 20px 40px; border-top: 1px solid #f1f5f9; background-color: #fafafa;">
        <table role="presentation" width="100%">
          <tr>
            <td>
              <p style="margin: 0; color: #1e293b; font-weight: bold; font-size: 14px;">Anand Pandey</p>
              <p style="margin: 0; color: #64748b; font-size: 12px;">founder, Jeevo</p>
            </td>
            <td style="text-align: right;">
              <p style="margin: 0; color: #dc2626; font-weight: bold; font-size: 12px;">Saving lives in real-time.</p>
            </td>
          </tr>
        </table>
      </div>

      <div style="background-color: #1e293b; padding: 20px; text-align: center;">
        <p style="color: #94a3b8; font-size: 11px; margin: 0;">
          &copy; 2026 Jeevo Health-Tech. All rights reserved. <br/>
          Partnered with verified hospitals and blood camps.
        </p>
      </div>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ success: true, message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Error in sendOtp2Email:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, gmail, otp } = req.body || {};
    const userEmail = normalizeEmail(email || gmail);
    const normalizedOtp = String(otp || '').trim();

    if (!userEmail || !normalizedOtp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    const user = await User.findOne({ gmail: userEmail });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    if (!user.otp || !user.otpExpiry) {
      return res
        .status(400)
        .json({ success: false, message: 'OTP not requested' });
    }

    if (new Date(user.otpExpiry).getTime() < Date.now()) {
      await User.updateOne(
        { _id: user._id },
        { otp: undefined, otpExpiry: undefined }
      );

      return res.status(410).json({ success: false, message: 'OTP expired' });
    }

    if (String(user.otp) !== normalizedOtp) {
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    }

    await User.updateOne(
      { _id: user._id },
      { isLoggedin: true, otp: undefined, otpExpiry: undefined }
    );

    const role = user.role || 'donor';
    const tokenPayload = {
      _id: user._id,
      role,
      isLoggedin: true,
      isGenuineHero: Boolean(user.isGenuineHero),
    };
    const token = createToken(tokenPayload);

    if (!token) {
      return res
        .status(500)
        .json({ success: false, message: 'Failed to sign token' });
    }

    const isProduction = process.env.NODE_ENV === 'production';
    const tokenCookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 60,
    };
    const publicCookieOptions = {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 60,
    };

    res.cookie('token', token, tokenCookieOptions);
    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        token,
        user: {
          _id: user._id,
          role,
          isLoggedin: true,
          isGenuineHero: Boolean(user.isGenuineHero),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { sendOtp2Email, verifyOtp };
