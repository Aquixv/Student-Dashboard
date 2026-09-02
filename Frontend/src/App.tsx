import { Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import Home from './Home';
import CourseRegistration from './Components/CourseReg';
import './App.css';
import SchoolFees from './Components/SchoolFees';
import Timetable from './Components/Timetables';
import Results from './Components/Results';
import Profile from './Components/Profile';
import Help from './Components/Help';
import Settings from './Components/Settings';
import Login from './Login/Login';
import Signup from './Login/Signup';

function App() {
  return (
    <Routes>
      {/* 1. Standalone Routes (No Sidebar/Navbar) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 2. Dashboard Layout Route (Catches everything else) */}
      <Route path="/*" element={
        <div className="layout-container">
          <Sidebar />
          <div className="main-wrapper">
            <Navbar />
            <main className="dashboard-content">
              {/* Nested routes specifically for the dashboard area */}
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
      } />
    </Routes>
  );
}

export default App;