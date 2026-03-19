import mongoose, { Schema } from 'mongoose';

const RequestSchema = new Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientDetails: {
      image: {
        type: String,
        default: null,
      },
      name: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
      },
      dob: {
        type: Date,
        default: null,
      },
      phone: {
        country: {
          type: String,
          default: '+91',
        },
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
      },
      address: {
        hospitalName: {
          type: String,
          required: true,
          trim: true,
        },
        line1: {
          type: String,
          required: true,
        },
        country: { type: String, required: true },
        state: { type: String, required: true },
        district: {
          type: String,
          required: true,
        },
        pincode: {
          type: String,
          required: true,
        },
      },
    },
    requirement: {
      bloodGroup: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        trim: true,
        uppercase: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [0, 'Quantity cannot be negative'],
      },
      unit: {
        type: String,
        required: true,
        enum: ['ml', 'units', 'liters'],
        default: 'units',
      },
    },
    urgency: {
      type: String,
      enum: ['normal', 'urgent', 'critical'],
      default: 'normal',
      index: true,
    },
    location: {
      lat: {
        type: Number,
        default: null,
      },
      lng: {
        type: Number,
        default: null,
      },
    },
    enrolledUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    approvedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    receivedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['active', 'closed', 'pending'],
      default: 'pending',
    },
    note: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true }
);

const Request =
  mongoose.models.Request || mongoose.model('Request', RequestSchema);
export default Request;
