import express from 'express';
import { User } from '../models/User.models.js';
import Request from '../models/Request.model.js';

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
    user.avatar,
    user.phone,
    user.bloodGroup,
    user.fullName?.firstName,
    user.address?.state,
    user.address?.district,
    user.address?.cityOrTown,
    user.address?.pincode,
  ];
  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
};

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
      .select(
        '_id patientName bloodType unitsRequired unitFullFilled status locationType customAddress createdAt updatedAt'
      )
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    const pendingRequests = createdRequests.filter(
      (request) => request.status === 'Pending'
    ).length;
    const closedRequests = createdRequests.filter(
      (request) => request.status === 'Closed'
    ).length;
    const requestedUnits = createdRequests.reduce(
      (sum, request) => sum + Number(request.unitsRequired || 0),
      0
    );
    const fulfilledUnits = createdRequests.reduce(
      (sum, request) => sum + Number(request.unitFullFilled || 0),
      0
    );

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

userRouter.get('/dashboard/:id', getDashboardData);
userRouter.get('/user/:id', getDashboardData);

export default userRouter;
