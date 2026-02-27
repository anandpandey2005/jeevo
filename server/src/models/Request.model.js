import mongoose, { Schema } from 'mongoose';
import { User } from './User.models.js';

const RequestSchema = new Schema(
  {
    createdBy: {
      type: String,
      trim: true,
      required: true,
    },
    verificationFile: { type: String, required: true },
    patientName: { type: String, required: true },
    age: { type: Number, required: true },
    bloodType: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    unitsRequired: { type: Number, default: 1 },
    unitFullFilled: {
      type: Number,
      default: null,
    },
    locationType: {
      type: String,
      enum: ['Live', 'Custom', 'Both'],
      required: true,
      default: 'Custom',
    },

    liveCoordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere' },
    },
    googleMapLink: {
      type: String,
      default: null,
    },
    customAddress: {
      hospitalName: { type: String, required: true },
      address: { type: String, trim: true, required: true },
      state: {
        type: String,
        trim: true,
        required: true,
      },
      district: {
        type: String,
        trim: true,
        required: true,
      },
      cityOrTown: {
        type: String,
        trim: true,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
        match: [
          /^[1-9][0-9]{5}$/,
          'Please provide a valid 6-digit Indian pincode',
        ],
      },
    },

    status: {
      type: String,
      enum: ['Pending', 'Closed'],
      default: 'Pending',
    },
    enrolledUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    donations: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        unitsDonated: { type: Number, required: true, default: 1 },
        donatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

RequestSchema.pre('save', function (next) {
  if (
    this.locationType === 'Live' &&
    !this.liveCoordinates.coordinates.length
  ) {
    next(new Error('Live coordinates are required when locationType is Live'));
  } else {
    next();
  }
});

const Request =
  mongoose.models.Request || mongoose.model('Request', RequestSchema);
export default Request;
