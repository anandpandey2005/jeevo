import express from 'express';
import { User } from '../models/User.models.js';
import Request from '../models/Request.model.js';

const publicRouter = express.Router();

publicRouter.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalDonors, totalHeroes, totalRequests, pendingRequests] =
      await Promise.all([
        User.countDocuments({}),
        User.countDocuments({ role: 'donor' }),
        User.countDocuments({ role: 'hero' }),
        Request.countDocuments({}),
        Request.countDocuments({ status: 'pending' }),
      ]);

    return res.status(200).json({
      success: true,
      message: 'Public stats fetched successfully',
      data: {
        totalUsers,
        totalDonors,
        totalHeroes,
        totalRequests,
        pendingRequests,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
});

export default publicRouter;
