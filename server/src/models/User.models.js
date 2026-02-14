import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    avatar: {
      type: String,
      default: null,
    },
    _id: {
      type: String,
      required: [true, "email is required"],
    },
    fullName: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
    },
    phone: {
      type: String,
      default: null,
    },

    address: {
      country: {
        type: String,
        trim: true,
        required: true,
      },
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
    otpVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, _id: false },
);
