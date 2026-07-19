import express from 'express';
import {
  getMealPlans,
  getMealPlanById,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
  getMealPlansByDietitian,
  getActiveMealPlan
} from '../controllers/mealPlanController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all meal plans for user
router.get('/', getMealPlans);

// Get active meal plan
router.get('/active', getActiveMealPlan);

// Get meal plans by dietitian
router.get('/dietitian/:dietitianId', getMealPlansByDietitian);

// Get single meal plan
router.get('/:id', getMealPlanById);

// Create meal plan
router.post('/', createMealPlan);

// Update meal plan
router.put('/:id', updateMealPlan);

// Delete meal plan
router.delete('/:id', deleteMealPlan);

export default router;