import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import RoleSelection from './components/RoleSelection';
import UserLogin from './components/UserLogin';
import DietitianLogin from './components/DietitianLogin';
import AdminLogin from './components/AdminLogin';
import UserRegister from './components/UserRegister';
import DietitianRegister from './components/DietitianRegister';
import AdminRegister from './components/AdminRegister';
import Dashboard from './components/Dashboard';
import MealPlanPage from './components/MealPlanPage';
import ProgressPage from './components/ProgressPage';
import BMIPage from './components/BMIPage';
import CalorieCalcPage from './components/CalorieCalcPage';
import AppointmentsPage from './components/AppointmentsPage';
import RecipesPage from './components/RecipesPage';
import FoodSearchPage from './components/FoodSearchPage';
import ProfilePage from './components/ProfilePage';
import NotificationsPage from './components/NotificationsPage';
import AdminDashboard from './components/AdminDashboard';
import ManageUsers from './components/ManageUsers';
import ManageDietitians from './components/ManageDietitians';
import AnalyticsPage from './components/AnalyticsPage';
import DietitianDashboard from './components/DietitianDashboard';
import DietitianClientsPage from './components/DietitianClientsPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('dashboard');
  const [authStep, setAuthStep] = useState('role-select');
  const [selectedRole, setSelectedRole] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(value => !value);
  };

  const handleOpenNotifications = () => {
    if (user) setPage('notifications');
  };

  const handleOpenProfile = () => {
    if (user) setPage('profile');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#6B7280'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    // Handle navigation between login and register pages
    const handleSelectRole = (role, mode) => {
      setSelectedRole(role);
      setAuthMode(mode);
      if (mode === 'login') {
        setAuthStep(`${role}-login`);
      } else {
        setAuthStep(`${role}-register`);
      }
    };

    switch (authStep) {
      case 'role-select':
        return <RoleSelection onSelectRole={handleSelectRole} />;
      
      case 'user-login':
        return <UserLogin 
          onBack={() => setAuthStep('role-select')}
          onRegister={() => {
            setSelectedRole('user');
            setAuthStep('user-register');
          }}
        />;
      
      case 'dietitian-login':
        return <DietitianLogin 
          onBack={() => setAuthStep('role-select')}
          onRegister={() => {
            setSelectedRole('dietitian');
            setAuthStep('dietitian-register');
          }}
        />;
      
      case 'admin-login':
        return <AdminLogin 
          onBack={() => setAuthStep('role-select')}
          onRegister={() => {
            setSelectedRole('admin');
            setAuthStep('admin-register');
          }}
        />;
      
      case 'user-register':
        return <UserRegister 
          onBack={() => setAuthStep('role-select')}
          onLogin={() => setAuthStep('user-login')}
        />;
      
      case 'dietitian-register':
        return <DietitianRegister 
          onBack={() => setAuthStep('role-select')}
          onLogin={() => setAuthStep('dietitian-login')}
        />;
      
      case 'admin-register':
        return <AdminRegister 
          onBack={() => setAuthStep('role-select')}
          onLogin={() => setAuthStep('admin-login')}
        />;
      
      default:
        return <RoleSelection onSelectRole={handleSelectRole} />;
    }
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard': 
        if (user.role === 'admin') return <AdminDashboard onNavigate={setPage} />;
        if (user.role === 'dietitian') return <DietitianDashboard onNavigate={setPage} />;
        return <Dashboard onNavigate={setPage} />;
      case 'meal-plan': return <MealPlanPage />;
      case 'recipes': return <RecipesPage />;
      case 'food-search': return <FoodSearchPage />;
      case 'progress': return <ProgressPage />;
      case 'bmi': return <BMIPage />;
      case 'calorie-calc': return <CalorieCalcPage />;
      case 'appointments': return <AppointmentsPage />;
      case 'notifications': return <NotificationsPage />;
      case 'profile': return <ProfilePage />;
      case 'admin-dashboard': return <AdminDashboard onNavigate={setPage} />;
      case 'manage-users': return <ManageUsers />;
      case 'manage-dietitians': return <ManageDietitians />;
      case 'analytics': return <AnalyticsPage />;
      case 'clients': return <DietitianClientsPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar currentPage={page} setPage={setPage} />
      <div className="main">
        <Topbar
          title={page.replace('-', ' ').toUpperCase()}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onOpenNotifications={handleOpenNotifications}
          onOpenProfile={handleOpenProfile}
        />
        {renderPage()}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;











// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           type="button"
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

// export default App
