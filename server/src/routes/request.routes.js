import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  approveEnrollment,
  createRequest,
  enrollRequest,
  listMyRequests,
  listRequests,
  markDonated,
  rejectEnrollment,
  updateRequest,
} from '../controller/request.controller.js';

const requestRouter = express.Router();

requestRouter.get('/', listRequests);
requestRouter.get('/mine', authMiddleware, listMyRequests);
requestRouter.post('/', authMiddleware, createRequest);
requestRouter.patch('/:id', authMiddleware, updateRequest);
requestRouter.post('/:id/enroll', authMiddleware, enrollRequest);
requestRouter.post('/:id/approve', authMiddleware, approveEnrollment);
requestRouter.post('/:id/reject', authMiddleware, rejectEnrollment);
requestRouter.post('/:id/mark-donated', authMiddleware, markDonated);

export default requestRouter;
