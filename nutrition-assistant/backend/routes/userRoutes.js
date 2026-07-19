// import express from 'express';
// import User from '../models/User.js';
// import auth from '../middleware/auth.js';

// const router = express.Router();

// router.get('/', auth, async (req, res) => {
//   try {
//     if (req.userRole !== 'admin') {
//       return res.status(403).json({ message: 'Access denied' });
//     }
//     const users = await User.find().select('-password');
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.put('/:id/status', auth, async (req, res) => {
//   try {
//     if (req.userRole !== 'admin') {
//       return res.status(403).json({ message: 'Access denied' });
//     }
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { status: req.body.status },
//       { new: true }
//     ).select('-password');
//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// export default router;

import express from 'express';
import {
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser
} from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all users (admin only)
router.get('/', getUsers);

// Get user by ID
router.get('/:id', getUserById);

// Update user status (admin only)
router.put('/:id/status', updateUserStatus);

// Delete user (admin only)
router.delete('/:id', deleteUser);

export default router;