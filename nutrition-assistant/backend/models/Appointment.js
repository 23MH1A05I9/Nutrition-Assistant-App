import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dietitianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  type: { type: String, enum: ['Initial Consultation', 'Follow-up', 'Progress Review', 'Emergency'] },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Appointment', appointmentSchema);