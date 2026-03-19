import { User } from '../models/User.models.js';
import verifyToken from '../utils/jwt/verifyToken.jwt.utiils.js';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = String(req.headers?.authorization || '');
    const tokenFromHeader = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : authHeader.trim();
    const token = req.cookies?.token || tokenFromHeader;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Authentication token missing' });
    }

    const payload = verifyToken(token);
    if (!payload || !payload._id) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid or expired token' });
    }

    if (!payload.isLoggedin) {
      return res
        .status(401)
        .json({ success: false, message: 'User is not logged in' });
    }

    const user = await User.findById(payload._id).lean();
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'User not found' });
    }

    if (!user.isLoggedin) {
      return res
        .status(401)
        .json({ success: false, message: 'User is not logged in' });
    }

    req.user = {
      _id: user._id,
      email: user.gmail || null,
      role: user.role || 'user',
      isLoggedin: user.isLoggedin,
      isGenuineHero: Boolean(user.isGenuineHero),
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
      error: error.message,
    });
  }
};

export default authMiddleware;
