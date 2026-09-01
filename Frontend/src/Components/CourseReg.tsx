import { useState } from 'react';
import './CourseReg.css';
import { useNavigate } from 'react-router-dom';

export default function CourseRegistration() {
  // Toggle to true to see the UI clear up and become interactive
  const [isFeesPaid, setIsFeesPaid] = useState(false);
  const navigate = useNavigate()
  const availableCourses = [
    { code: 'CSC 201', title: 'Computer Programming I', units: 3, type: 'Compulsory' },
    { code: 'CSC 203', title: 'Introduction to Databases', units: 3, type: 'Compulsory' },
    { code: 'MTH 201', title: 'Mathematical Methods I', units: 3, type: 'Compulsory' },
    { code: 'PHY 205', title: 'General Physics III', units: 2, type: 'Elective' },
  ];

  return (
    <div className="registration-wrapper">
      
      {/* The Lock Overlay - Only renders if fees are unpaid */}
      {!isFeesPaid && (
        <div className="lock-overlay">
          <div className="lock-content">
            <span className="lock-icon">🔒</span>
            <h2>Portal Locked</h2>
            <p>You must clear your outstanding Harmattan semester fees to unlock course registration.</p>
            <button className="primary-btn pay-btn" onClick={() => navigate("/fees")}>Proceed to Pay Fees</button>
          </div>
        </div>
      )}

      {/* The Actual Registration UI - Blurred and disabled if locked */}
      <div className={`registration-content ${!isFeesPaid ? 'locked-blur' : ''}`}>
        <div className="registration-header">
          <h2>Harmattan Semester Registration</h2>
          <p>Select your courses for the 2026/2027 academic session. Maximum of 24 units allowed.</p>
        </div>

        <div className="registration-split">
          {/* Left Side: Course Selection */}
          <div className="course-selection-panel">
            <div className="panel-header">
              <h3>Available Courses</h3>
            </div>
            <div className="course-list">
              {availableCourses.map((course) => (
                <div key={course.code} className="course-card">
                  <div className="course-info">
                    <span className="course-code">{course.code}</span>
                    <h4>{course.title}</h4>
                    <span className={`course-type ${course.type.toLowerCase()}`}>{course.type}</span>
                  </div>
                  <div className="course-action">
                    <span className="units">{course.units} Units</span>
                    <input type="checkbox" className="course-checkbox" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Summary / Cart */}
          <div className="registration-summary-panel">
            <div className="panel-header">
              <h3>Selected Courses</h3>
            </div>
            <div className="summary-content">
              <div className="empty-state">
                <p>No courses selected yet.</p>
              </div>
              
              <div className="summary-footer">
                <div className="unit-counter">
                  <span>Total Units:</span>
                  <strong>0 / 24</strong>
                </div>
                <button className="primary-btn submit-btn" disabled>
                  Submit Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}