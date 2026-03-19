import mongoose, { Schema } from 'mongoose';
import Request from './Request.model.js';
const UserSchema = new Schema(
  {
    image: {
      type: String,
      default: null,
    },
    name: {
      first: {
        type: String,
        trim: true,
        default: null,
      },
      last: {
        type: String,
        trim: true,
        default: null,
      },
    },
    gmail: {
      type: String,
      trim: true,
      unique: [true, 'Already Exists'],
      lowercase: true,
    },
    phone: {
      number: {
        type: String,
        trim: true,
        index: { unique: true, sparse: true },
        validate: {
          validator: function (v) {
            return /\d{10}/.test(v);
          },
          message: (props) => `${props.value} is not a valid phone number!`,
        },
      },
      country: {
        type: String,
        default: '+91',
        trim: true,
      },
      isOtpVerified: {
        type: Boolean,
        default: false,
      },
    },
    address: {
      line1: {
        type: String,
        trim: true,
        required: true,
      },
      line2: {
        type: String,
        default: null,
        trim: true,
        lowercase: true,
      },
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
      pincode: {
        type: String,
        required: true,
        match: [
          /^[1-9][0-9]{5}$/,
          'Please provide a valid 6-digit Indian pincode',
        ],
      },
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      index: true,
      default: null,
    },
    history: {
      requests: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'request',
        },
      ],
      Donated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'request' }],
    },
    level: {
      type: Number,
      default: 1,
    },
    otp: {
      type: Number,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    isLoggedin: {
      type: Boolean,
      default: false,
    },
    isGenuineHero: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// UserSchema.pre(['save', 'updateOne', 'updateMany'], function (next) {
//   if (this.isModified('level') && this.level > 5) {
//     this.isGenuineHero = true;
//   }
//   next();
// });

export const User = mongoose.model('User', UserSchema);
