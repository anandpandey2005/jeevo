import mongoose, { Schema } from 'mongoose';

const SponsoredSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    logo: {
      type: String,
      default: null,
    },
    website: {
      type: String,
      trim: true,
    },
 
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'captured', 'failed', 'refunded'],
      default: 'pending',
    },
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    amountPaid: {
      type: Number,
      required: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Sponsored = mongoose.model('Sponsored', SponsoredSchema);
