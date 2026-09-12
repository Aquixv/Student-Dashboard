import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
// Fix 1: Import AdminRoute with curly braces!
import ProtectedRoute, { AdminRoute } from './ProtectedRoutes'; 
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import Home from './Home';
import CourseRegistration from './Components/CourseReg';
import AdminDashboard from './Components/AdminDashboard';
import './App.css';
import SchoolFees from './Components/SchoolFees';
import Timetable from './Components/Timetables';
import Results from './Components/Results';
import Profile from './Components/Profile';
import Help from './Components/Help';
import Settings from './Components/Settings';
import Login from './Login/Login';
import Signup from './Login/Signup';
import AdminLogin from './Components/AdminLogin';

function App() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <Routes>
      {/* 1. Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Fix 2: Standalone Admin Layout (Moved OUTSIDE the student wrapper) */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route> 

   {/* 3. Protected Student Layout Wrapper */}
      <Route element={<ProtectedRoute />}>
        {/* Everything inside here requires a valid portal_token in localStorage */}
        <Route path="/*" element={
          <div className="layout-container" style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'scroll' }}>
            
            {/* 🚨 FIX 1: THE MISSING HAMBURGER HEADER 🚨 */}
            <div className="mobile-header">
              <h2 style={{ color: '#095DC5', margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>EPortal</h2>
              <button 
                className="hamburger-btn" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>

            <div className="main-wrapper" style={{ display: 'flex', flex: 1, minHeight: 0 }}>
              
              {/* 🚨 FIX 2: THE DYNAMIC WRAPPER 🚨 */}
              <div className={`portal-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <Sidebar closeMenu={() => setIsMobileMenuOpen(false)} />
              </div>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <Navbar />
                <main className="dashboard-content" style={{ flex: 1, overflowY: 'auto' }}>
                  <Routes>
                    <Route path="/" element={<div className='Intro'><Home /></div>} />
                    <Route path="/fees" element={<div className='Intro'><SchoolFees/></div>} />
                    <Route path="/registration" element={<CourseRegistration />} />
                    <Route path="/timetable" element={<Timetable />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </main>
              </div>

            </div>
          </div>
        } />
      </Route>
    </Routes>
  );
}

export default App;