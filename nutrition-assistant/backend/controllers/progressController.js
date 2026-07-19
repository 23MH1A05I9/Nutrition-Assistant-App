// import Progress from '../models/Progress.js';

// export const getProgress = async (req, res) => {
//   try {
//     const progress = await Progress.find({ userId: req.userId })
//       .sort({ date: -1 });
//     res.json(progress);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const addProgress = async (req, res) => {
//   try {
//     const progress = new Progress({
//       ...req.body,
//       userId: req.userId
//     });
//     await progress.save();
//     res.status(201).json(progress);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const updateProgress = async (req, res) => {
//   try {
//     const progress = await Progress.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!progress) {
//       return res.status(404).json({ message: 'Progress not found' });
//     }
//     res.json(progress);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
import Progress from '../models/Progress.js';
import User from '../models/User.js';

// Get all progress entries for user
export const getProgress = async (req, res) => {
  try {
    let query = {};
    
    // Filter based on role
    if (req.userRole === 'admin') {
      // Admin can see all progress
      if (req.query.userId) {
        query = { userId: req.query.userId };
      }
    } else if (req.userRole === 'dietitian') {
      // Dietitian can see their clients' progress
      if (req.query.userId) {
        query = { userId: req.query.userId };
      } else {
        // If no userId specified, get all clients' progress
        // This would need client list from dietitian profile
        query = {};
      }
    } else {
      // Regular user sees their own progress
      query = { userId: req.userId };
    }
    
    const progress = await Progress.find(query)
      .populate('userId', 'name email')
      .sort({ date: -1 });
    
    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get progress by date
export const getProgressByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    const query = {
      userId: req.userId,
      date: { $gte: date, $lt: nextDate }
    };
    
    const progress = await Progress.findOne(query);
    
    if (!progress) {
      return res.status(404).json({ message: 'No progress found for this date' });
    }
    
    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress by date:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get latest progress entry
export const getLatestProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      userId: req.userId
    }).sort({ date: -1 });
    
    if (!progress) {
      return res.status(404).json({ message: 'No progress found' });
    }
    
    res.json(progress);
  } catch (error) {
    console.error('Error fetching latest progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get progress statistics
export const getProgressStats = async (req, res) => {
  try {
    const userId = req.userId;
    
    const progress = await Progress.find({ userId }).sort({ date: -1 });
    
    if (progress.length === 0) {
      return res.json({
        totalEntries: 0,
        averageWeight: 0,
        averageCalories: 0,
        averageWater: 0,
        averageSleep: 0,
        weightChange: 0,
        latestWeight: 0,
        firstWeight: 0
      });
    }
    
    const weights = progress.map(p => p.weight).filter(w => w);
    const calories = progress.map(p => p.caloriesConsumed).filter(c => c);
    const water = progress.map(p => p.waterIntake).filter(w => w);
    const sleep = progress.map(p => p.sleepHours).filter(s => s);
    
    const stats = {
      totalEntries: progress.length,
      averageWeight: weights.length > 0 ? weights.reduce((a, b) => a + b, 0) / weights.length : 0,
      averageCalories: calories.length > 0 ? calories.reduce((a, b) => a + b, 0) / calories.length : 0,
      averageWater: water.length > 0 ? water.reduce((a, b) => a + b, 0) / water.length : 0,
      averageSleep: sleep.length > 0 ? sleep.reduce((a, b) => a + b, 0) / sleep.length : 0,
      weightChange: weights.length > 1 ? weights[weights.length - 1] - weights[0] : 0,
      latestWeight: weights.length > 0 ? weights[weights.length - 1] : 0,
      firstWeight: weights.length > 0 ? weights[0] : 0
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching progress stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add progress entry
export const addProgress = async (req, res) => {
  try {
    const { date, weight, caloriesConsumed, caloriesBurned, waterIntake, sleepHours, mood, notes } = req.body;
    
    // Calculate BMI if weight and height are available
    let bmi = null;
    if (weight) {
      const user = await User.findById(req.userId);
      if (user && user.height) {
        const heightInMeters = user.height / 100;
        bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
      }
    }
    
    const progress = new Progress({
      userId: req.userId,
      date: date ? new Date(date) : new Date(),
      weight,
      bmi,
      caloriesConsumed,
      caloriesBurned,
      waterIntake,
      sleepHours,
      mood,
      notes
    });
    
    await progress.save();
    
    // Update user's current weight and BMI
    if (weight) {
      await User.findByIdAndUpdate(req.userId, { weight, bmi });
    }
    
    res.status(201).json(progress);
  } catch (error) {
    console.error('Error adding progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update progress entry
export const updateProgress = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    
    // Check authorization
    if (req.userRole !== 'admin' && 
        progress.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== '__v' && key !== 'userId') {
        progress[key] = updates[key];
      }
    });
    
    // Recalculate BMI if weight is updated
    if (updates.weight) {
      const user = await User.findById(progress.userId);
      if (user && user.height) {
        const heightInMeters = user.height / 100;
        progress.bmi = parseFloat((updates.weight / (heightInMeters * heightInMeters)).toFixed(1));
      }
    }
    
    await progress.save();
    
    res.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete progress entry
export const deleteProgress = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    
    // Check authorization
    if (req.userRole !== 'admin' && 
        progress.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    await Progress.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Progress entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};