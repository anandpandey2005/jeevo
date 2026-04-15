const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, DonorProfile, EmailOtp } = require('../models');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  registerValidation,
  loginValidation,
  emailOtpRequestValidation,
  emailOtpVerifyValidation
} = require('../middleware/validators');
const { syncDonorProfileStats } = require('../services/donorStatsService');
const { sendEmail } = require('../services/emailService');

const router = express.Router();

const OTP_LENGTH = 6;
const OTP_TTL_MINUTES = 10;
const OTP_RESEND_COOLDOWN_SECONDS = 60;
const OTP_MAX_ATTEMPTS = 5;

const normalizeEmail = (value) => (value || '').toString().trim().toLowerCase();
const normalizePhone = (value) => (value || '').toString().trim().replace(/[\s-]/g, '');

const generateOtpCode = () => {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
};

const hashOtp = (value) => crypto.createHash('sha256').update(String(value)).digest('hex');

const buildClientUrl = (path = '') => {
  const base = process.env.CLIENT_URL || 'http://localhost:3000';
  const cleanBase = base.replace(/\/+$/, '');
  const cleanPath = String(path).replace(/^\/+/, '');
  return cleanPath ? `${cleanBase}/${cleanPath}` : cleanBase;
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar
      }
    });
};

// @route   POST /api/auth/request-otp
// @desc    Request email OTP for signup
// @access  Public
router.post('/request-otp', emailOtpRequestValidation, asyncHandler(async (req, res) => {
  const normalizedEmail = normalizeEmail(req.body.email);

  const existingUser = await User.upsert({ email: normalizedEmail });
  console.log("user not found from the database");
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'Email already registered. Please log in or reset your password.'
    });
  }

  const now = new Date();
  const existingOtp = await EmailOtp.findOne({ email: normalizedEmail });

  if (existingOtp?.lastSentAt && now - existingOtp.lastSentAt < OTP_RESEND_COOLDOWN_SECONDS * 1000) {
    return res.status(429).json({
      success: false,
      message: 'Please wait a moment before requesting another code.'
    });
  }

  const otpCode = generateOtpCode();
  const otpHash = hashOtp(otpCode);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await EmailOtp.findOneAndUpdate(
    { email: normalizedEmail },
    {
      email: normalizedEmail,
      otpHash,
      expiresAt,
      attempts: 0,
      verifiedAt: null,
      lastSentAt: now
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const emailResult = await sendEmail(normalizedEmail, 'emailOtp', {
    code: otpCode,
    expiresInMinutes: OTP_TTL_MINUTES
  });

  if (!emailResult?.success && !emailResult?.skipped) {
    return res.status(500).json({
      success: false,
      message: 'Unable to send verification email. Please try again shortly.'
    });
  }

  if (emailResult?.skipped && process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      success: false,
      message: 'Email service is not configured. Please contact support.'
    });
  }

  res.json({
    success: true,
    message: 'OTP sent to your email',
    ...(process.env.NODE_ENV !== 'production' && (!emailResult?.success || emailResult?.skipped) && { otp: otpCode })
  });
}));

// @route   POST /api/auth/verify-otp
// @desc    Verify email OTP for signup
// @access  Public
router.post('/verify-otp', emailOtpVerifyValidation, asyncHandler(async (req, res) => {
  const normalizedEmail = normalizeEmail(req.body.email);
  const otp = String(req.body.otp || '').trim();

  const record = await EmailOtp.findOne({ email: normalizedEmail });

  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({
      success: false,
      message: 'OTP expired or not found. Please request a new code.'
    });
  }

  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    return res.status(429).json({
      success: false,
      message: 'Too many invalid attempts. Please request a new code.'
    });
  }

  const matches = record.otpHash === hashOtp(otp);

  if (!matches) {
    record.attempts += 1;
    await record.save();
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP. Please try again.'
    });
  }

  record.verifiedAt = new Date();
  record.attempts = 0;
  await record.save();

  const otpToken = jwt.sign(
    { email: normalizedEmail, type: 'email_otp' },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  res.json({
    success: true,
    message: 'Email verified successfully',
    otpToken
  });
}));

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerValidation, asyncHandler(async (req, res) => {
  const { email, phone, password, firstName, lastName, role, bloodGroup, location, address, weight, height, otpToken } = req.body;

  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);

  if (!otpToken) {
    return res.status(400).json({
      success: false,
      message: 'Email verification is required before registration.'
    });
  }

  let otpPayload;
  try {
    otpPayload = jwt.verify(otpToken, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Email verification expired. Please verify again.'
    });
  }

  if (otpPayload?.type !== 'email_otp' || otpPayload?.email !== normalizedEmail) {
    return res.status(401).json({
      success: false,
      message: 'Email verification does not match. Please verify again.'
    });
  }

  const otpRecord = await EmailOtp.findOne({ email: normalizedEmail });
  if (!otpRecord?.verifiedAt) {
    return res.status(401).json({
      success: false,
      message: 'Email verification required. Please verify your email.'
    });
  }

  const existingEmail = await User.findOne({ email: normalizedEmail });
  if (existingEmail) {
    return res.status(409).json({
      success: false,
      message: 'Email already registered. Please log in or reset your password.'
    });
  }

  const existingPhone = await User.findOne({ phone: normalizedPhone });
  if (existingPhone) {
    return res.status(409).json({
      success: false,
      message: 'Phone number already registered.'
    });
  }

  // Create user
  const user = await User.create({
    email: normalizedEmail,
    phone: normalizedPhone,
    password,
    firstName,
    lastName,
    role: role || 'user',
    isVerified: true,
    location,
    address
  });

  // If donor, create donor profile only when required fields are provided.
  // The signup UI may not collect full health info (e.g., weight) yet.
  if (role === 'donor' && bloodGroup && weight) {
    await DonorProfile.create({
      user: user._id,
      bloodGroup,
      weight,
      ...(height ? { height } : {})
    });
  }

  // Emit socket event for real-time updates
  if (req.io) {
    req.io.emit('new_user_registered', {
      role: user.role,
      city: address?.city
    });
  }

  sendTokenResponse(user, 201, res);

  void sendEmail(user.email, 'welcome', user).catch(() => {});

  await EmailOtp.deleteOne({ email: normalizedEmail });
}));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = normalizeEmail(email);

  // Find user with password
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if user is blocked
  if (user.isBlocked) {
    return res.status(403).json({
      success: false,
      message: 'Your account has been blocked. Please contact support.'
    });
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);

  const loginMeta = {
    time: new Date(),
    ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip,
    userAgent: req.get('user-agent')
  };

  void sendEmail(user.email, 'loginAlert', { user, meta: loginMeta }).catch(() => {});
}));

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  const donorSnapshot = await syncDonorProfileStats(user._id);
  const donorProfile = donorSnapshot?.donorProfile || null;

  res.json({
    success: true,
    user,
    donorProfile
  });
}));

// @route   POST /api/auth/logout
// @desc    Logout user / clear cookie
// @access  Private
router.post('/logout', protect, asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
router.put('/update-profile', protect, asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    address: req.body.address,
    location: req.body.location,
    avatar: req.body.avatar,
    notifications: req.body.notifications
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key => 
    fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findByIdAndUpdate(
    req.user.id,
    fieldsToUpdate,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    user
  });
}));

// @route   PUT /api/auth/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', protect, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
}));

// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post('/forgot-password', asyncHandler(async (req, res) => {
  const normalizedEmail = normalizeEmail(req.body.email);
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'No user found with that email'
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save({ validateBeforeSave: false });

  const resetUrl = buildClientUrl(`/reset-password?token=${resetToken}`);

  const emailResult = await sendEmail(user.email, 'passwordReset', [user, resetUrl]);

  if (!emailResult?.success && !emailResult?.skipped) {
    return res.status(500).json({
      success: false,
      message: 'Unable to send reset email. Please try again later.'
    });
  }

  if (emailResult?.skipped && process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      success: false,
      message: 'Email service is not configured. Please contact support.'
    });
  }

  res.json({
    success: true,
    message: 'Password reset email sent',
    // Only in development:
    ...(process.env.NODE_ENV === 'development' && { resetToken })
  });
}));

// @route   PUT /api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.put('/reset-password/:token', asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token'
    });
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
}));

// @route   POST /api/auth/verify-email
// @desc    Verify email (placeholder)
// @access  Private
router.post('/verify-email', protect, asyncHandler(async (req, res) => {
  // In production, send verification email and handle token
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { isVerified: true },
    { new: true }
  );

  res.json({
    success: true,
    message: 'Email verified successfully',
    user
  });
}));

module.exports = router;
