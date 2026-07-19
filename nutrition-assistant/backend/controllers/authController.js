// import User from '../models/User.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// export const register = async (req, res) => {
//   try {
//     const { name, email, password, role, ...rest } = req.body;
    
//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role: role || 'user',
//       ...rest
//     });

//     await user.save();

//     // Generate token
//     const token = jwt.sign(
//       { id: user._id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.status(201).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         ...rest
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign(
//       { id: user._id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         gender: user.gender,
//         age: user.age,
//         height: user.height,
//         weight: user.weight,
//         bmi: user.bmi,
//         activityLevel: user.activityLevel,
//         dietaryPreference: user.dietaryPreference,
//         allergies: user.allergies,
//         phone: user.phone
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).select('-password');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const updateProfile = async (req, res) => {
//   try {
//     const updates = req.body;
//     delete updates.password;
//     delete updates.email;

//     if (req.userId !== updates.id && req.userRole !== 'admin') {
//       return res.status(403).json({ message: 'Unauthorized' });
//     }

//     const user = await User.findByIdAndUpdate(
//       req.userId,
//       updates,
//       { new: true }
//     ).select('-password');

//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };/
import User from '../models/User.js';
import Dietitian from '../models/Dietitian.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const allowedRoles = new Set(['user', 'dietitian', 'admin']);
const getAdminRegistrationKey = () => process.env.ADMIN_REGISTRATION_KEY || 'admin123';

// Register new user
export const register = async (req, res) => {
  try {
    const { 
      name, email, password, role, phone, gender, age, height, weight, 
      activityLevel, dietaryPreference, allergies, dietitianDetails, adminKey 
    } = req.body;

    const normalizedRole = (role || 'user').toLowerCase();

    if (!allowedRoles.has(normalizedRole)) {
      return res.status(400).json({ message: 'Invalid account role' });
    }

    if (normalizedRole === 'admin' && adminKey !== getAdminRegistrationKey()) {
      return res.status(403).json({ message: 'Invalid admin key' });
    }

    if (normalizedRole === 'dietitian' && (!dietitianDetails || !dietitianDetails.qualification || !dietitianDetails.specialization)) {
      return res.status(400).json({ message: 'Dietitian professional details are required' });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: normalizedRole,
      phone,
      gender,
      age: parseInt(age),
      height: parseFloat(height),
      weight: parseFloat(weight),
      bmi,
      activityLevel: activityLevel || 'Moderate',
      dietaryPreference: dietaryPreference || 'Vegetarian',
      allergies: allergies || [],
      status: 'Active'
    });

    await user.save();

    // If role is dietitian, create dietitian profile
    if (normalizedRole === 'dietitian') {
      const dietitian = new Dietitian({
        userId: user._id,
        qualification: dietitianDetails.qualification,
        specialization: dietitianDetails.specialization,
        experience: parseInt(dietitianDetails.experience || '0', 10),
        isApproved: false, // Needs admin approval
        clients: []
      });
      await dietitian.save();
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        age: user.age,
        height: user.height,
        weight: user.weight,
        bmi: user.bmi,
        activityLevel: user.activityLevel,
        dietaryPreference: user.dietaryPreference,
        allergies: user.allergies,
        phone: user.phone,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const normalizedRole = (role || '').toLowerCase();

    if (!allowedRoles.has(normalizedRole)) {
      return res.status(400).json({ message: 'Role is required for login' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user has the correct role
    if (user.role !== normalizedRole) {
      return res.status(401).json({ 
        message: `This account is registered as a ${user.role}. Please login with the correct role.` 
      });
    }

    // Check if user is blocked
    if (user.status === 'Blocked') {
      return res.status(401).json({ message: 'Your account has been blocked. Please contact admin.' });
    }

    // Check if dietitian is approved
    if (user.role === 'dietitian') {
      const dietitian = await Dietitian.findOne({ userId: user._id });
      if (dietitian && !dietitian.isApproved) {
        return res.status(401).json({ 
          message: 'Your dietitian account is pending approval. Please wait for admin approval.' 
        });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        age: user.age,
        height: user.height,
        weight: user.weight,
        bmi: user.bmi,
        activityLevel: user.activityLevel,
        dietaryPreference: user.dietaryPreference,
        allergies: user.allergies,
        phone: user.phone,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    // Remove fields that shouldn't be updated directly
    delete updates.password;
    delete updates.email;
    delete updates.role;
    delete updates._id;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

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
    console.error('Get users error:', error);
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
    
    // Check authorization
    if (req.userRole !== 'admin' && req.userId !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
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
    console.error('Update user status error:', error);
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
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};