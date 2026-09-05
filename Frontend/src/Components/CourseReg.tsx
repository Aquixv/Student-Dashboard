import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ME, GET_AVAILABLE_COURSES } from '../graphql/queries';
import type { Course, GetAvailableCoursesResponse, GetMeResponse } from '../types';
import './CourseReg.css';

export default function CourseRegistration() {
  const { data: userData, loading: userLoading } = useQuery<GetMeResponse>(GET_ME);
  const { data: coursesData, loading: coursesLoading } = useQuery<GetAvailableCoursesResponse>(GET_AVAILABLE_COURSES);

  // 1. Add state to track which courses are selected
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  if (userLoading || coursesLoading) return <div>Loading portal...</div>;

  const isFeesPaid = userData?.me?.hasPaidFees || false;
  const availableCourses: Course[] = coursesData?.availableCourses || [];

  // 2. Toggle function for checkboxes
  const handleToggleCourse = (courseId: string) => {
    setSelectedCourseIds((prevSelected) => 
      prevSelected.includes(courseId)
        ? prevSelected.filter((id) => id !== courseId) // Remove if already checked
        : [...prevSelected, courseId] // Add if not checked
    );
  };

  // 3. Derived state for the right panel
  const selectedCourses = availableCourses.filter(course => selectedCourseIds.includes(course.id));
  const totalUnits = selectedCourses.reduce((sum, course) => sum + course.units, 0);
  const isOverLimit = totalUnits > 24;

  return (
    <div className="registration-wrapper">
      {!isFeesPaid && (
        <div className="lock-overlay">
          <div className="lock-content">
            <span className="lock-icon">🔒</span>
            <h2>Portal Locked</h2>
            <p>You must clear your outstanding Harmattan semester fees to unlock course registration.</p>
            <button className="primary-btn pay-btn">Go to School Fees</button>
          </div>
        </div>
      )}

      <div className={`registration-content ${!isFeesPaid ? 'locked-blur' : ''}`}>
        <div className="registration-header">
          <h2>Harmattan Semester Registration</h2>
          <p>Select your courses for the 2026/2027 academic session. Maximum of 24 units allowed.</p>
        </div>

        <div className="registration-split">
          <div className="course-selection-panel">
            <div className="panel-header">
              <h3>Available Courses</h3>
            </div>
            <div className="course-list">
              {availableCourses.map((course) => (
                <div key={course.id} className="course-card">
                  <div className="course-info">
                    <span className="course-code">{course.code}</span>
                    <h4>{course.title}</h4>
                    <span className={`course-type ${course.type.toLowerCase()}`}>{course.type}</span>
                  </div>
                  <div className="course-action">
                    <span className="units">{course.units} Units</span>
                    {/* 4. Bind the input to React state */}
                    <input 
                      type="checkbox" 
                      className="course-checkbox" 
                      disabled={!isFeesPaid}
                      checked={selectedCourseIds.includes(course.id)}
                      onChange={() => handleToggleCourse(course.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="registration-summary-panel">
            <div className="panel-header">
              <h3>Selected Courses</h3>
            </div>
            <div className="summary-content">
              {/* 5. Conditionally render the empty state or the selected list */}
              {selectedCourses.length === 0 ? (
                <div className="empty-state">
                  <p>No courses selected yet.</p>
                </div>
              ) : (
                <div className="selected-courses-list" style={{ flexGrow: 1, overflowY: 'auto' }}>
                  {selectedCourses.map((course) => (
                    <div key={course.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                      <strong>{course.code}</strong>
                      <span>{course.units} Units</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="summary-footer">
                <div className="unit-counter" style={{ color: isOverLimit ? 'red' : 'inherit' }}>
                  <span>Total Units:</span>
                  <strong>{totalUnits} / 24</strong>
                </div>
                {/* 6. Disable submission if empty or over limit */}
                <button 
                  className="primary-btn submit-btn" 
                  disabled={selectedCourses.length === 0 || isOverLimit}
                >
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