import { Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import Home from './Home';
import CourseRegistration from './Components/CourseReg';
import './App.css'
import SchoolFees from './Components/SchoolFees';
import Timetable from './Components/Timetables';
import Results from './Components/Results';
import Profile from './Components/Profile';
import Help from './Components/Help';
import Settings from './Components/Settings';
function App() {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar />
        <main className="dashboard-content">
          <Routes>
            <Route path="/" element={<div className='Intro'>Welcome, User<Home /></div>} />
            <Route path="/fees" element={<div className='Intro'>School Fees<SchoolFees/></div>} />
            <Route path="/registration" element={<CourseRegistration />} />
            <Route path="/timetable" element={<div><Timetable></Timetable></div>} />
            <Route path="/results" element={<div><Results></Results></div>} />
            <Route path="/profile" element={<div><Profile/></div>} />
            <Route path="/help" element={<div><Help/></div>} />
            <Route path="/settings" element={<div><Settings/></div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;