import mongoose, { Schema } from 'mongoose';

const RequestSchema = new Schema(
  {
    verificationFile: { type: String, required: true },
    patientName: { type: String, required: true },
    age: { type: Number, required: true },
    bloodType: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    unitsRequired: { type: Number, default: 1 },
    unitFullFill: {
      type: Number,
      default: 1,
    },
    locationType: {
      type: String,
      enum: ['Live', 'Custom'],
      required: true,
      default: 'Custom',
    },

    liveCoordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere' },
    },

    customAddress: {
      hospitalName: { type: String, required: true },
      fullAddress: { type: String },
      city: { type: String },
      landmark: { type: String },
    },

    isSponsored: {
      type: Boolean,
      default: false,
    },
    giftDetails: {
      amount: { type: Number, default: 0 },
      giftType: { type: String },
      description: { type: String },
    },

    status: {
      type: String,
      enum: ['Pending', 'Fulfilled', 'Cancelled'],
      default: 'Pending',
    },
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
