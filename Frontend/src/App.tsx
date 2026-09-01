import { Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import Home from './Home';
import CourseRegistration from './Components/CourseReg';
import './App.css'
import SchoolFees from './Components/SchoolFees';
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
            <Route path="/timetable" element={<div>Timetable Page</div>} />
            <Route path="/results" element={<div>Results Page</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;