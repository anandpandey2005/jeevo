import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User.models.js';
import Request from '../models/Request.model.js';
import authMiddleware from '../middleware/auth.middleware.js';

const userRouter = express.Router();

const normalizeUserId = (value = '') => {
  const trimmedValue = String(value || '').trim();
  if (!trimmedValue) return '';

  try {
    return decodeURIComponent(trimmedValue).toLowerCase();
  } catch {
    return trimmedValue.toLowerCase();
  }
};

const getProfileCompletion = (user = {}) => {
  const checks = [
    user.image,
    user.phone?.number,
    user.bloodGroup,
    user.name?.first,
    user.address?.line1,
    user.address?.state,
    user.address?.district,
    user.address?.pincode,
  ];
  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
};

const normalizeText = (value = '') => String(value || '').trim();

const getDashboardData = async (req, res) => {
  try {
    const userId = normalizeUserId(req.params.id);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User id is required in path params',
        data: null,
      });
    }

    const user = await User.findById(userId)
      .select('-otp -otpExpiry')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null,
      });
    }

    const createdRequests = await Request.find({ createdBy: userId })
      .select('_id patientDetails requirement status urgency createdAt updatedAt')
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    const pendingRequests = createdRequests.filter(
      (request) => request.status === 'pending' || request.status === 'active'
    ).length;
    const closedRequests = createdRequests.filter(
      (request) => request.status === 'closed'
    ).length;
    const requestedUnits = createdRequests.reduce(
      (sum, request) => sum + Number(request.requirement?.quantity || 0),
      0
    );
    const fulfilledUnits = 0;

    return res.status(200).json({
      success: true,
      message: 'Dashboard data fetched successfully',
      data: {
        user,
        stats: {
          level: Number(user.level || 1),
          profileCompletion: getProfileCompletion(user),
          totalRequestsCreated: createdRequests.length,
          pendingRequests,
          closedRequests,
          requestedUnits,
          fulfilledUnits,
        },
        recentRequests: createdRequests,
      },
    });
  } catch (error) {
    console.error('Failed to fetch dashboard user data:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching dashboard data',
      data: null,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized' });
    }

    const userObjectId =
      typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

    const [
      user,
      createdRequests,
      donatedRequests,
      createdCount,
      donatedCount,
      pendingCount,
      closedCount,
      requestedUnitsAgg,
    ] = await Promise.all([
      User.findById(userId).select('-otp -otpExpiry').lean(),
      Request.find({ createdBy: userId })
        .select('_id patientDetails requirement status urgency createdAt')
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      Request.find({ receivedBy: userId })
        .select('_id patientDetails requirement status urgency createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Request.countDocuments({ createdBy: userId }),
      Request.countDocuments({ receivedBy: userId }),
      Request.countDocuments({
        createdBy: userId,
        status: { $in: ['pending', 'active'] },
      }),
      Request.countDocuments({ createdBy: userId, status: 'closed' }),
      Request.aggregate([
        { $match: { createdBy: userObjectId } },
        { $group: { _id: null, total: { $sum: '$requirement.quantity' } } },
      ]),
    ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      data: {
        user,
        stats: {
          level: Number(user.level || 1),
          profileCompletion: getProfileCompletion(user),
          totalRequestsCreated: createdCount,
          pendingRequests: pendingCount,
          closedRequests: closedCount,
          requestedUnits: requestedUnitsAgg?.[0]?.total || 0,
          fulfilledUnits: 0,
        },
        recentRequests: createdRequests,
        history: {
          created: createdRequests,
          donated: donatedRequests,
          createdCount,
          donatedCount,
        },
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized' });
    }

    const payload = req.body || {};
    const updates = {};

    const firstName =
      payload.name?.first ||
      payload.firstName ||
      payload.first ||
      payload.fullName?.first;
    const lastName =
      payload.name?.last ||
      payload.lastName ||
      payload.last ||
      payload.fullName?.last;
    const image = payload.image || payload.avatar;
    const bloodGroup = payload.bloodGroup || payload.bloodType;

    if (firstName) updates['name.first'] = normalizeText(firstName);
    if (lastName) updates['name.last'] = normalizeText(lastName);
    if (image) updates.image = normalizeText(image);
    if (bloodGroup) updates.bloodGroup = normalizeText(bloodGroup);

    const phoneNumber =
      payload.phone?.number || payload.phoneNumber || payload.phone;
    const phoneCountry =
      payload.phone?.country || payload.phoneCountry || payload.countryCode;
    if (phoneNumber) updates['phone.number'] = normalizeText(phoneNumber);
    if (phoneCountry) updates['phone.country'] = normalizeText(phoneCountry);

    const addressLine1 =
      payload.address?.line1 || payload.addressLine1 || payload.line1;
    const addressLine2 =
      payload.address?.line2 || payload.addressLine2 || payload.line2;
    const country = payload.address?.country || payload.country;
    const state = payload.address?.state || payload.state;
    const district = payload.address?.district || payload.district;
    const pincode = payload.address?.pincode || payload.pincode;

    if (addressLine1)
      updates['address.line1'] = normalizeText(addressLine1);
    if (addressLine2)
      updates['address.line2'] = normalizeText(addressLine2);
    if (country) updates['address.country'] = normalizeText(country);
    if (state) updates['address.state'] = normalizeText(state);
    if (district) updates['address.district'] = normalizeText(district);
    if (pincode) updates['address.pincode'] = normalizeText(pincode);

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update',
      });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select('-otp -otpExpiry');

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

userRouter.get('/me', authMiddleware, getMe);
userRouter.patch('/me', authMiddleware, updateProfile);
userRouter.get('/dashboard/:id', getDashboardData);
userRouter.get('/user/:id', getDashboardData);

export default userRouter;
