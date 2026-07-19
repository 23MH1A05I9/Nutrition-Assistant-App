import mongoose from 'mongoose';

const dietitianSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  qualification: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  availability: [{
    day: { type: String },
    slots: [{ type: String }]
  }],
  isApproved: { type: Boolean, default: false }
});

export default mongoose.model('Dietitian', dietitianSchema);