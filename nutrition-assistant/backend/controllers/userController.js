import User from '../models/User.js';
import Dietitian from '../models/Dietitian.js';
import MealPlan from '../models/MealPlan.js';
import Appointment from '../models/Appointment.js';
import Progress from '../models/Progress.js';

// Get all users (admin only)
export const getUsers = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is admin or requesting their own profile
    if (req.userRole !== 'admin' && req.userId !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user status (admin only)
export const updateUserStatus = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { status } = req.body;
    if (!status || !['Active', 'Blocked'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete associated data
    await Dietitian.deleteMany({ userId: req.params.id });
    await MealPlan.deleteMany({ userId: req.params.id });
    await Appointment.deleteMany({ userId: req.params.id });
    await Progress.deleteMany({ userId: req.params.id });
    
    res.json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user statistics (admin only)
export const getUserStats = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'Active' });
    const blockedUsers = await User.countDocuments({ status: 'Blocked' });
    const dietitians = await User.countDocuments({ role: 'dietitian' });
    
    const usersByDietaryPreference = await User.aggregate([
      { $group: { _id: '$dietaryPreference', count: { $sum: 1 } } }
    ]);
    
    const usersByActivityLevel = await User.aggregate([
      { $group: { _id: '$activityLevel', count: { $sum: 1 } } }
    ]);
    
    res.json({
      totalUsers,
      activeUsers,
      blockedUsers,
      dietitians,
      usersByDietaryPreference,
      usersByActivityLevel
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};