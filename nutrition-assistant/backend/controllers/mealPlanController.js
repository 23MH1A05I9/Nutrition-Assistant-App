// import MealPlan from '../models/MealPlan.js';

// export const getMealPlans = async (req, res) => {
//   try {
//     const plans = await MealPlan.find({ 
//       $or: [{ userId: req.userId }, { isActive: true }] 
//     }).populate('dietitianId', 'name');
//     res.json(plans);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const createMealPlan = async (req, res) => {
//   try {
//     const plan = new MealPlan({
//       ...req.body,
//       userId: req.userId
//     });
//     await plan.save();
//     res.status(201).json(plan);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const updateMealPlan = async (req, res) => {
//   try {
//     const plan = await MealPlan.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!plan) {
//       return res.status(404).json({ message: 'Meal plan not found' });
//     }
//     res.json(plan);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const deleteMealPlan = async (req, res) => {
//   try {
//     await MealPlan.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Meal plan deleted' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
import MealPlan from '../models/MealPlan.js';
import User from '../models/User.js';

// Get all meal plans for user
export const getMealPlans = async (req, res) => {
  try {
    let query = {};
    
    // Filter based on role
    if (req.userRole === 'admin') {
      // Admin sees all meal plans
      query = {};
    } else if (req.userRole === 'dietitian') {
      // Dietitian sees meal plans they created
      query = { dietitianId: req.userId };
    } else {
      // Regular user sees their own meal plans
      query = { userId: req.userId };
    }
    
    const plans = await MealPlan.find(query)
      .populate('userId', 'name email')
      .populate('dietitianId', 'name email')
      .sort({ createdDate: -1 });
    
    res.json(plans);
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get meal plan by ID
export const getMealPlanById = async (req, res) => {
  try {
    const plan = await MealPlan.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('dietitianId', 'name email');
    
    if (!plan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    
    // Check authorization
    if (req.userRole !== 'admin' && 
        plan.userId._id.toString() !== req.userId && 
        plan.dietitianId?._id.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.json(plan);
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get active meal plan for user
export const getActiveMealPlan = async (req, res) => {
  try {
    const plan = await MealPlan.findOne({
      userId: req.userId,
      isActive: true
    }).populate('dietitianId', 'name email');
    
    if (!plan) {
      return res.status(404).json({ message: 'No active meal plan found' });
    }
    
    res.json(plan);
  } catch (error) {
    console.error('Error fetching active meal plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get meal plans by dietitian
export const getMealPlansByDietitian = async (req, res) => {
  try {
    const plans = await MealPlan.find({
      dietitianId: req.params.dietitianId
    }).populate('userId', 'name email');
    
    res.json(plans);
  } catch (error) {
    console.error('Error fetching meal plans by dietitian:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create meal plan
export const createMealPlan = async (req, res) => {
  try {
    const { userId, title, description, calories, protein, carbohydrates, fats, fiber, breakfast, lunch, snacks, dinner, instructions } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is dietitian or admin
    if (req.userRole !== 'admin' && req.userRole !== 'dietitian') {
      return res.status(403).json({ message: 'Only dietitians and admins can create meal plans' });
    }
    
    // If user is dietitian, they can only create for their clients
    if (req.userRole === 'dietitian') {
      const dietitian = await User.findOne({ _id: req.userId, role: 'dietitian' });
      if (!dietitian) {
        return res.status(403).json({ message: 'Dietitian profile not found' });
      }
    }
    
    // Deactivate old active meal plan for this user
    await MealPlan.updateMany(
      { userId, isActive: true },
      { isActive: false }
    );
    
    const plan = new MealPlan({
      userId,
      dietitianId: req.userId,
      title,
      description,
      calories,
      protein,
      carbohydrates,
      fats,
      fiber,
      breakfast: breakfast || [],
      lunch: lunch || [],
      snacks: snacks || [],
      dinner: dinner || [],
      instructions: instructions || '',
      isActive: true,
      createdDate: new Date()
    });
    
    await plan.save();
    
    const populatedPlan = await MealPlan.findById(plan._id)
      .populate('userId', 'name email')
      .populate('dietitianId', 'name email');
    
    res.status(201).json(populatedPlan);
  } catch (error) {
    console.error('Error creating meal plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update meal plan
export const updateMealPlan = async (req, res) => {
  try {
    const plan = await MealPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    
    // Check authorization
    if (req.userRole !== 'admin' && 
        plan.dietitianId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        plan[key] = updates[key];
      }
    });
    
    plan.updatedDate = new Date();
    await plan.save();
    
    const updatedPlan = await MealPlan.findById(plan._id)
      .populate('userId', 'name email')
      .populate('dietitianId', 'name email');
    
    res.json(updatedPlan);
  } catch (error) {
    console.error('Error updating meal plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete meal plan
export const deleteMealPlan = async (req, res) => {
  try {
    const plan = await MealPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    
    // Check authorization
    if (req.userRole !== 'admin' && 
        plan.dietitianId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    await MealPlan.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Meal plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};