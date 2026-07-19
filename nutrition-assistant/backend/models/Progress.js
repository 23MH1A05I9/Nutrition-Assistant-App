import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  weight: { type: Number },
  bmi: { type: Number },
  caloriesConsumed: { type: Number },
  caloriesBurned: { type: Number },
  waterIntake: { type: Number },
  sleepHours: { type: Number },
  mood: { type: String },
  notes: { type: String }
});

export default mongoose.model('Progress', progressSchema);