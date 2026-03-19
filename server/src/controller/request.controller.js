import Request from '../models/Request.model.js';
import { User } from '../models/User.models.js';
import verifyToken from '../utils/jwt/verifyToken.jwt.utiils.js';

const normalizeText = (value = '') => String(value || '').trim();

const normalizeBloodGroup = (value = '') => {
  const normalized = normalizeText(value).toUpperCase();
  return normalized || null;
};

const parseUrgency = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) return null;
  if (['urgent', 'critical', 'normal'].includes(normalized)) return normalized;
  if (['true', '1', 'yes'].includes(normalized)) return 'urgent';
  if (['false', '0', 'no'].includes(normalized)) return 'normal';
  return null;
};

const escapeRegex = (value = '') =>
  String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getOptionalUserId = (req) => {
  const authHeader = String(req.headers?.authorization || '');
  const tokenFromHeader = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : authHeader.trim();
  const token = req.cookies?.token || tokenFromHeader;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || !payload._id || !payload.isLoggedin) return null;
  return String(payload._id);
};

const buildFilters = (query = {}) => {
  const {
    status,
    bloodGroup,
    pincode,
    state,
    district,
    urgency,
    search,
    q,
  } = query;

  const filters = {};

  if (status && status !== 'all') {
    filters.status = String(status).toLowerCase();
  }

  const normalizedBloodGroup = normalizeBloodGroup(bloodGroup);
  if (normalizedBloodGroup) {
    filters['requirement.bloodGroup'] = normalizedBloodGroup;
  }

  const normalizedUrgency = parseUrgency(urgency);
  if (normalizedUrgency) {
    filters.urgency = normalizedUrgency;
  }

  if (pincode) {
    filters['patientDetails.address.pincode'] = normalizeText(pincode);
  }

  if (state) {
    filters['patientDetails.address.state'] = new RegExp(
      `^${escapeRegex(state)}$`,
      'i'
    );
  }

  if (district) {
    filters['patientDetails.address.district'] = new RegExp(
      `^${escapeRegex(district)}$`,
      'i'
    );
  }

  const searchTerm = normalizeText(search || q);
  if (searchTerm) {
    const pattern = new RegExp(escapeRegex(searchTerm), 'i');
    filters.$or = [
      { 'patientDetails.name': pattern },
      { 'patientDetails.address.hospitalName': pattern },
      { 'patientDetails.address.district': pattern },
      { 'patientDetails.address.state': pattern },
      { 'patientDetails.address.pincode': pattern },
      { 'requirement.bloodGroup': pattern },
    ];
  }

  return filters;
};

const createRequest = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized' });
    }

    const payload = req.body || {};
    const patientDetails = payload.patientDetails || {
      name: normalizeText(payload.patientName || payload.name),
      dob: payload.patientDob || payload.dob || null,
      phone: {
        country: normalizeText(payload.patientPhoneCountry || '+91'),
        number: normalizeText(payload.patientPhone || payload.phone),
      },
      address: {
        hospitalName: normalizeText(payload.hospitalName),
        line1: normalizeText(payload.addressLine1 || payload.line1),
        country: normalizeText(payload.country || 'India'),
        state: normalizeText(payload.state),
        district: normalizeText(payload.district),
        pincode: normalizeText(payload.pincode),
      },
    };

    const requirement = payload.requirement || {
      bloodGroup: normalizeBloodGroup(
        payload.bloodGroup || payload.bloodType
      ),
      quantity: Number(payload.quantity || payload.unitsRequired || 0),
      unit: normalizeText(payload.unit || 'units'),
    };

    const urgency = parseUrgency(payload.urgency || payload.urgent);
    const note = normalizeText(payload.note);
    const latitude = Number(
      payload.latitude ?? payload.lat ?? payload.location?.lat
    );
    const longitude = Number(
      payload.longitude ?? payload.lng ?? payload.location?.lng
    );
    const location =
      Number.isFinite(latitude) && Number.isFinite(longitude)
        ? { lat: latitude, lng: longitude }
        : null;

    const missingFields = [];
    if (!patientDetails.name) missingFields.push('patientName');
    if (!patientDetails.address?.hospitalName)
      missingFields.push('hospitalName');
    if (!patientDetails.address?.line1) missingFields.push('addressLine1');
    if (!patientDetails.address?.country) missingFields.push('country');
    if (!patientDetails.address?.state) missingFields.push('state');
    if (!patientDetails.address?.district) missingFields.push('district');
    if (!patientDetails.address?.pincode) missingFields.push('pincode');
    if (!requirement.bloodGroup) missingFields.push('bloodGroup');
    if (!requirement.quantity) missingFields.push('quantity');

    if (missingFields.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    const request = await Request.create({
      createdBy: userId,
      patientDetails,
      requirement,
      urgency: urgency || 'normal',
      note: note || null,
      ...(location ? { location } : {}),
    });

    await User.updateOne(
      { _id: userId },
      { $addToSet: { 'history.requests': request._id } }
    );

    return res.status(201).json({
      success: true,
      message: 'Request created successfully',
      data: request,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

const listRequests = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query || {};

    const filters = buildFilters(req.query || {});
    const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 200);
    const safePage = Math.max(Number(page) || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await Promise.all([
      Request.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      Request.countDocuments(filters),
    ]);

    const viewerId = getOptionalUserId(req);
    const sanitizedItems = items.map((request) => {
      const approvedIds = Array.isArray(request.approvedUsers)
        ? request.approvedUsers.map((item) => String(item))
        : [];
      const isOwner =
        viewerId && String(request.createdBy) === String(viewerId);
      const isApproved = viewerId && approvedIds.includes(String(viewerId));
      const canViewSensitive = Boolean(isOwner || isApproved);

      const patientDetails = request.patientDetails || {};
      const address = patientDetails.address || {};
      const phone = patientDetails.phone || {};

      const safeRequest = {
        ...request,
        enrolledUsers: viewerId ? request.enrolledUsers || [] : [],
        approvedUsers: viewerId ? request.approvedUsers || [] : [],
      };

      if (!canViewSensitive) {
        return {
          ...safeRequest,
          patientDetails: {
            ...patientDetails,
            phone: {
              country: phone.country || '+91',
              number: null,
            },
            address: {
              ...address,
              line1: null,
            },
          },
          contactVisible: false,
        };
      }

      return {
        ...safeRequest,
        patientDetails: {
          ...patientDetails,
          address: {
            ...address,
          },
          phone: {
            ...phone,
          },
        },
        contactVisible: true,
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Requests fetched successfully',
      data: sanitizedItems,
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

const listMyRequests = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized' });
    }

    const { page = 1, limit = 50 } = req.query || {};
    const filters = buildFilters(req.query || {});
    filters.createdBy = userId;

    const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 200);
    const safePage = Math.max(Number(page) || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await Promise.all([
      Request.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .populate('enrolledUsers', 'gmail name level isGenuineHero role')
        .populate('approvedUsers', 'gmail name level isGenuineHero role')
        .populate('receivedBy', 'gmail name level isGenuineHero role')
        .lean(),
      Request.countDocuments(filters),
    ]);

    return res.status(200).json({
      success: true,
      message: 'My requests fetched successfully',
      data: items,
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

const enrollRequest = async (req, res) => {
  try {
    const userId = req.user?._id;
    const requestId = req.params.id;

    if (!userId || !requestId) {
      return res
        .status(400)
        .json({ success: false, message: 'Request id is required' });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: 'Request not found' });
    }

    if (String(request.createdBy) === String(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot enroll in your own request',
      });
    }

    await Request.updateOne(
      { _id: requestId },
      { $addToSet: { enrolledUsers: userId } }
    );

    return res.status(200).json({
      success: true,
      message: 'Enrollment recorded successfully',
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

const approveEnrollment = async (req, res) => {
  try {
    const userId = req.user?._id;
    const requestId = req.params.id;
    const { donorId } = req.body || {};

    if (!userId || !requestId || !donorId) {
      return res.status(400).json({
        success: false,
        message: 'Request id and donor id are required',
      });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: 'Request not found' });
    }

    if (String(request.createdBy) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Only the requestor can approve donors',
      });
    }

    await Request.updateOne(
      { _id: requestId },
      {
        $addToSet: { approvedUsers: donorId, enrolledUsers: donorId },
        $set: { status: 'active' },
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Donor approved successfully',
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

const rejectEnrollment = async (req, res) => {
  try {
    const userId = req.user?._id;
    const requestId = req.params.id;
    const { donorId } = req.body || {};

    if (!userId || !requestId || !donorId) {
      return res.status(400).json({
        success: false,
        message: 'Request id and donor id are required',
      });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: 'Request not found' });
    }

    if (String(request.createdBy) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Only the requestor can reject donors',
      });
    }

    await Request.updateOne(
      { _id: requestId },
      { $pull: { enrolledUsers: donorId, approvedUsers: donorId } }
    );

    return res.status(200).json({
      success: true,
      message: 'Donor rejected successfully',
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

const markDonated = async (req, res) => {
  try {
    const userId = req.user?._id;
    const requestId = req.params.id;
    const { donorId, closeRequest = true } = req.body || {};

    if (!userId || !requestId || !donorId) {
      return res.status(400).json({
        success: false,
        message: 'Request id and donor id are required',
      });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: 'Request not found' });
    }

    if (String(request.createdBy) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Only the requestor can mark donation',
      });
    }

    await Request.updateOne(
      { _id: requestId },
      {
        $addToSet: { receivedBy: donorId, approvedUsers: donorId },
        ...(closeRequest ? { $set: { status: 'closed' } } : {}),
      }
    );

    const updatedDonor = await User.findByIdAndUpdate(
      donorId,
      {
        $inc: { level: 1 },
        $addToSet: { 'history.Donated': requestId },
      },
      { new: true }
    );

    if (updatedDonor && updatedDonor.level > 5 && !updatedDonor.isGenuineHero) {
      await User.updateOne(
        { _id: donorId },
        { isGenuineHero: true }
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Donation marked successfully',
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

const updateRequest = async (req, res) => {
  try {
    const userId = req.user?._id;
    const requestId = req.params.id;

    if (!userId || !requestId) {
      return res
        .status(400)
        .json({ success: false, message: 'Request id is required' });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: 'Request not found' });
    }

    if (String(request.createdBy) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Only the requestor can update this request',
      });
    }

    const payload = req.body || {};
    const updates = {};

    if (payload.patientName) {
      updates['patientDetails.name'] = normalizeText(payload.patientName);
    }
    if (payload.hospitalName) {
      updates['patientDetails.address.hospitalName'] = normalizeText(
        payload.hospitalName
      );
    }
    if (payload.addressLine1) {
      updates['patientDetails.address.line1'] = normalizeText(
        payload.addressLine1
      );
    }
    if (payload.state) {
      updates['patientDetails.address.state'] = normalizeText(payload.state);
    }
    if (payload.district) {
      updates['patientDetails.address.district'] = normalizeText(payload.district);
    }
    if (payload.pincode) {
      updates['patientDetails.address.pincode'] = normalizeText(payload.pincode);
    }
    if (payload.bloodGroup) {
      updates['requirement.bloodGroup'] = normalizeBloodGroup(payload.bloodGroup);
    }
    if (payload.quantity) {
      updates['requirement.quantity'] = Number(payload.quantity);
    }
    if (payload.unit) {
      updates['requirement.unit'] = normalizeText(payload.unit);
    }
    if (payload.urgency) {
      updates.urgency = parseUrgency(payload.urgency) || 'normal';
    }
    if (payload.note) {
      updates.note = normalizeText(payload.note);
    }
    if (payload.status) {
      updates.status = String(payload.status).toLowerCase();
    }

    const latitude = Number(
      payload.latitude ?? payload.lat ?? payload.location?.lat
    );
    const longitude = Number(
      payload.longitude ?? payload.lng ?? payload.location?.lng
    );
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      updates.location = { lat: latitude, lng: longitude };
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update',
      });
    }

    const updated = await Request.findByIdAndUpdate(requestId, updates, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Request updated successfully',
      data: updated,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

export {
  createRequest,
  listRequests,
  listMyRequests,
  enrollRequest,
  approveEnrollment,
  rejectEnrollment,
  markDonated,
  updateRequest,
};
