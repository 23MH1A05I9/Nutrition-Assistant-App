// import Appointment from '../models/Appointment.js';

// export const getAppointments = async (req, res) => {
//   try {
//     const query = req.userRole === 'admin' 
//       ? {} 
//       : req.userRole === 'dietitian'
//         ? { dietitianId: req.userId }
//         : { userId: req.userId };

//     const appointments = await Appointment.find(query)
//       .populate('userId', 'name email')
//       .populate('dietitianId', 'name email')
//       .sort({ date: -1 });
//     res.json(appointments);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const createAppointment = async (req, res) => {
//   try {
//     const appointment = new Appointment({
//       ...req.body,
//       userId: req.userId
//     });
//     await appointment.save();
//     res.status(201).json(appointment);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const updateAppointment = async (req, res) => {
//   try {
//     const appointment = await Appointment.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!appointment) {
//       return res.status(404).json({ message: 'Appointment not found' });
//     }
//     res.json(appointment);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Dietitian from '../models/Dietitian.js';

// Get appointments (filtered by role)
export const getAppointments = async (req, res) => {
  try {
    let query = {};
    
    // Filter based on role
    if (req.userRole === 'admin') {
      // Admin sees all appointments
      query = {};
    } else if (req.userRole === 'dietitian') {
      // Dietitian sees appointments where they are the dietitian
      const dietitian = await User.findOne({ _id: req.userId, role: 'dietitian' });
      if (dietitian) {
        query = { dietitianId: req.userId };
      } else {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    } else {
      // Regular user sees their own appointments
      query = { userId: req.userId };
    }
    
    const appointments = await Appointment.find(query)
      .populate('userId', 'name email phone')
      .populate('dietitianId', 'name email phone')
      .sort({ date: -1, time: 1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get upcoming appointments
export const getUpcomingAppointments = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let query = {
      date: { $gte: today },
      status: { $in: ['Pending', 'Confirmed'] }
    };
    
    // Filter based on role
    if (req.userRole === 'admin') {
      // Admin sees all upcoming appointments
    } else if (req.userRole === 'dietitian') {
      query.dietitianId = req.userId;
    } else {
      query.userId = req.userId;
    }
    
    const appointments = await Appointment.find(query)
      .populate('userId', 'name email')
      .populate('dietitianId', 'name email')
      .sort({ date: 1, time: 1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get appointments by date
export const getAppointmentsByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    let query = {
      date: { $gte: date, $lt: nextDate }
    };
    
    // Filter based on role
    if (req.userRole === 'admin') {
      // Admin sees all
    } else if (req.userRole === 'dietitian') {
      query.dietitianId = req.userId;
    } else {
      query.userId = req.userId;
    }
    
    const appointments = await Appointment.find(query)
      .populate('userId', 'name email')
      .populate('dietitianId', 'name email')
      .sort({ time: 1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments by date:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create appointment
export const createAppointment = async (req, res) => {
  try {
    const { dietitianId, date, time, type, notes } = req.body;
    let resolvedDietitianUserId = dietitianId;
    
    const dietitianProfile = await Dietitian.findOne({
      $or: [
        { userId: dietitianId },
        { _id: dietitianId }
      ]
    });

    if (dietitianProfile) {
      resolvedDietitianUserId = dietitianProfile.userId.toString();
    }

    // Check if dietitian exists and is approved
    const dietitian = await User.findOne({ _id: resolvedDietitianUserId, role: 'dietitian' });
    if (!dietitian) {
      return res.status(404).json({ message: 'Dietitian not found' });
    }

    if (dietitianProfile && !dietitianProfile.isApproved) {
      return res.status(400).json({ message: 'This dietitian is pending approval' });
    }
    
    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
      dietitianId: resolvedDietitianUserId,
      date: new Date(date),
      time,
      status: { $in: ['Pending', 'Confirmed'] }
    });
    
    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }
    
    const appointment = new Appointment({
      userId: req.userId,
      dietitianId: resolvedDietitianUserId,
      date: new Date(date),
      time,
      type: type || 'Initial Consultation',
      notes: notes || '',
      status: 'Pending'
    });
    
    await appointment.save();
    
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('userId', 'name email')
      .populate('dietitianId', 'name email');
    
    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update appointment
export const updateAppointment = async (req, res) => {
  try {
    const { date, time, type, status, notes } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check authorization
    if (req.userRole !== 'admin' && 
        appointment.userId.toString() !== req.userId && 
        appointment.dietitianId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Update fields
    if (date) appointment.date = new Date(date);
    if (time) appointment.time = time;
    if (type) appointment.type = type;
    if (status) appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;
    
    await appointment.save();
    
    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate('userId', 'name email')
      .populate('dietitianId', 'name email');
    
    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check authorization
    if (req.userRole !== 'admin' && 
        appointment.userId.toString() !== req.userId && 
        appointment.dietitianId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Check if appointment can be cancelled
    if (appointment.status === 'Completed') {
      return res.status(400).json({ message: 'Completed appointments cannot be cancelled' });
    }
    
    appointment.status = 'Cancelled';
    await appointment.save();
    
    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};