import express from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile,
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser
} from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

// Admin only routes
router.get('/users', auth, getUsers);
router.get('/users/:id', auth, getUserById);
router.put('/users/:id/status', auth, updateUserStatus);
router.delete('/users/:id', auth, deleteUser);

export default router;