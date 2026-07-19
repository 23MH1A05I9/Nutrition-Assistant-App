import express from 'express';
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getAppointmentsByDate,
  getUpcomingAppointments
} from '../controllers/appointmentController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get appointments (filtered by role)
router.get('/', getAppointments);

// Get upcoming appointments
router.get('/upcoming', getUpcomingAppointments);

// Get appointments by date
router.get('/date/:date', getAppointmentsByDate);

// Create appointment
router.post('/', createAppointment);

// Update appointment
router.put('/:id', updateAppointment);

// Cancel appointment
router.put('/:id/cancel', cancelAppointment);

export default router;