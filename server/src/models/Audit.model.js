import mongoose, { Schema } from 'mongoose';

const AuditSchema = new Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    userEmail: {
      type: String,
      lowercase: true,
    },
    action: { type: String, required: true },
    method: { type: String, uppercase: true },
    endpoint: { type: String, lowercase: true },
    statusCode: { type: Number },
    responseTime: { type: String },
    details: {
      os: String,
      device: String,
      browser: String,
      location: {
        city: { type: String, default: 'Unknown' },
        country: { type: String, default: 'Unknown' },
      },
      payload: { type: Schema.Types.Mixed },
    },
    ipAddress: { type: String, index: true },
  },
  { versionKey: false }
);

AuditSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

const Audit = mongoose.model('Audit', AuditSchema);
export default Audit;
