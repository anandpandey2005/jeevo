import mongoose, { Schema } from 'mongoose';

const CampSchema = new Schema({}, { timestamps: true });

const Camp = mongoose.models.Camp || mongoose.model('Camp', CampSchema);
export default Camp;
