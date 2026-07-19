// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   phone: { type: String },
//   role: { type: String, enum: ['user', 'dietitian', 'admin'], default: 'user' },
//   gender: { type: String, enum: ['Male', 'Female', 'Other'] },
//   age: { type: Number },
//   height: { type: Number },
//   weight: { type: Number },
//   bmi: { type: Number },
//   activityLevel: { type: String, enum: ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'] },
//   dietaryPreference: { type: String, enum: ['Vegetarian', 'Vegan', 'Non-Vegetarian', 'Pescatarian', 'Keto', 'Paleo'] },
//   allergies: [{ type: String }],
//   medicalConditions: [{ type: String }],
//   healthGoals: { type: String },
//   profileImage: { type: String },
//   isApproved: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.model('User', userSchema);

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['user', 'dietitian', 'admin'], default: 'user' },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  age: { type: Number },
  height: { type: Number },
  weight: { type: Number },
  bmi: { type: Number },
  activityLevel: { type: String, enum: ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'] },
  dietaryPreference: { type: String, enum: ['Vegetarian', 'Vegan', 'Non-Vegetarian', 'Pescatarian', 'Keto', 'Paleo'] },
  allergies: [{ type: String }],
  medicalConditions: [{ type: String }],
  healthGoals: { type: String },
  profileImage: { type: String },
  status: { type: String, enum: ['Active', 'Blocked'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);