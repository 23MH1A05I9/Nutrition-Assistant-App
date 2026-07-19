import mongoose from 'mongoose';

const mealItemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 }
});

const mealPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dietitianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String },
  calories: { type: Number, required: true },
  protein: { type: Number },
  carbohydrates: { type: Number },
  fats: { type: Number },
  fiber: { type: Number },
  breakfast: [mealItemSchema],
  lunch: [mealItemSchema],
  snacks: [mealItemSchema],
  dinner: [mealItemSchema],
  instructions: { type: String },
  isActive: { type: Boolean, default: true },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now }
});

export default mongoose.model('MealPlan', mealPlanSchema);