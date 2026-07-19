<!-- # React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project. -->



# NutriAssist - Nutrition Management System

A full-stack nutrition management application built with MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User authentication (Register/Login)
- Role-based access (User, Dietitian, Admin)
- Meal plan management
- Progress tracking (weight, BMI, calories)
- BMI Calculator
- Calorie Calculator
- Appointment booking with dietitians
- Recipe database
- Food search
- Admin dashboard for user/dietitian management

## Technology Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing

### Frontend
- React 18
- Chart.js for data visualization
- Vite for build tool
- Custom CSS with design tokens

## Installation

### Prerequisites
- Node.js (v16+)
- MongoDB installed locally or MongoDB Atlas account

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd nutrition-app