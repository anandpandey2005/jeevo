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
    phone: {
      type: String,
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
