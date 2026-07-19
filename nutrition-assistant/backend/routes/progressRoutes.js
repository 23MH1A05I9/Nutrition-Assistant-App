import express from 'express';
import {
  getProgress,
  getProgressByDate,
  getLatestProgress,
  addProgress,
  updateProgress,
  deleteProgress,
  getProgressStats
} from '../controllers/progressController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all progress for user
router.get('/', getProgress);

// Get latest progress
router.get('/latest', getLatestProgress);

// Get progress by date
router.get('/date/:date', getProgressByDate);

// Get progress statistics
router.get('/stats', getProgressStats);

// Add progress entry
router.post('/', addProgress);

// Update progress entry
router.put('/:id', updateProgress);

// Delete progress entry
router.delete('/:id', deleteProgress);

export default router;