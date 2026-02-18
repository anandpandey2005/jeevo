import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    avatar: {
      type: String,
      default: null,
    },
    _id: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, 'email is required'],
      index: true,
    },
    fullName: {
      firstName: {
        type: String,
        trim: true,
        default: null,
      },
      lastName: {
        type: String,
        trim: true,
        default: null,
      },
    },
    phone: {
      type: String,
      trim: true,
      index: true,
      default: null,
    },

    address: {
      country: {
        type: String,
        trim: true,
        default: null,
      },
      state: {
        type: String,
        trim: true,
        default: null,
      },
      district: {
        type: String,
        trim: true,
        default: null,
      },
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      index: true,
      default: null,
    },
    level: {
      type: Number,
      default: 1,
    },
    heart: {
      type: Number,
      default: null,
    },
    otp: {
      type: Number,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    emailotpVerified: {
      type: Boolean,
      default: false,
    },
    phoneotpVerified: {
      type: Boolean,
      default: false,
    },
    phoneotpExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, _id: false }
);

export const User = mongoose.model('User', UserSchema);
