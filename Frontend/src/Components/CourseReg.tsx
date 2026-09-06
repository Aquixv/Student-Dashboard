import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ME, GET_AVAILABLE_COURSES } from '../graphql/queries';
import { REGISTER_COURSES } from '../graphql/mutations';
import type { Course, GetAvailableCoursesResponse, GetMeResponse } from '../types';
import './CourseReg.css';

export default function CourseRegistration() {
  const { data: userData, loading: userLoading } = useQuery<GetMeResponse>(GET_ME);
  const { data: coursesData, loading: coursesLoading } = useQuery<GetAvailableCoursesResponse>(GET_AVAILABLE_COURSES);
  
  const [registerCourses, { loading: isSubmitting }] = useMutation(REGISTER_COURSES, {
    refetchQueries: [{ query: GET_ME }], 
  });

  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  // NEW: State to track if the user is in edit mode
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userData?.me?.registeredCourses && !hasInitialized) {
      const existingIds = userData.me.registeredCourses.map((c: any) => c.id);
      setSelectedCourseIds(existingIds);
      setHasInitialized(true);
    }
  }, [userData, hasInitialized]);

  if (userLoading || coursesLoading) return <div>Loading portal...</div>;

  const isFeesPaid = userData?.me?.hasPaidFees || false;
  const isAlreadyRegistered = (userData?.me?.registeredCourses?.length || 0) > 0;
  
  // NEW: Determine if the form should be locked down (read-only)
  const isReadOnly = isAlreadyRegistered && !isEditing;

  const availableCourses: Course[] = coursesData?.availableCourses || [];

  const handleToggleCourse = (courseId: string) => {
    setSelectedCourseIds((prev) => 
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const handleSubmit = async () => {
    try {
      await registerCourses({
        variables: { courseIds: selectedCourseIds }
      });
      // NEW: Lock the form back up after a successful update
      setIsEditing(false);
      alert(isAlreadyRegistered ? 'Registration successfully updated!' : 'Course registration submitted!');
    } catch (error) {
      console.error('Failed to register:', error);
      alert('An error occurred during registration.');
    }
  };

  const selectedCourses = availableCourses.filter(course => selectedCourseIds.includes(course.id));
  const totalUnits = selectedCourses.reduce((sum, course) => sum + course.units, 0);
  const isOverLimit = totalUnits > 24;
  const isUnchanged = isAlreadyRegistered && 
    JSON.stringify(selectedCourseIds.sort()) === JSON.stringify(userData?.me?.registeredCourses?.map((c: any) => c.id).sort());

  return (
    <div className="registration-wrapper">
      {!isFeesPaid && (
        <div className="lock-overlay">
          <div className="lock-content">
            <span className="lock-icon">🔒</span>
            <h2>Portal Locked</h2>
            <p>You must clear your outstanding Harmattan semester fees to unlock course registration.</p>
          </div>
        </div>
      )}

      {/* NEW: Apply a visual grey-out class if they are in read-only mode */}
      <div className={`registration-content ${!isFeesPaid ? 'locked-blur' : ''}`}>
        <div className="registration-header">
          <h2>Harmattan Semester Registration</h2>
          <p>Select your courses for the 2026/2027 academic session. Maximum of 24 units allowed.</p>
        </div>

        <div className="registration-split">
          <div className={`course-selection-panel ${isReadOnly ? 'read-only-panel' : ''}`}>
            <div className="panel-header">
              <h3>Available Courses {isReadOnly && '(Locked)'}</h3>
            </div>
            <div className="course-list">
              {availableCourses.map((course) => (
                <div key={course.id} className="course-card" style={{ opacity: isReadOnly ? 0.6 : 1 }}>
                  <div className="course-info">
                    <span className="course-code">{course.code}</span>
                    <h4>{course.title}</h4>
                    <span className={`course-type ${course.type.toLowerCase()}`}>{course.type}</span>
                  </div>
                  <div className="course-action">
                    <span className="units">{course.units} Units</span>
                    <input 
                      type="checkbox" 
                      className="course-checkbox" 
                      // NEW: Disable checkboxes if fees aren't paid OR if it's read-only
                      disabled={!isFeesPaid || isReadOnly}
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
              <h3>{isAlreadyRegistered ? 'Current Registration' : 'Selected Courses'}</h3>
            </div>
            <div className="summary-content">
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
                
                {/* NEW: Conditional Button Render */}
                {isReadOnly ? (
                  <button 
                    className="primary-btn submit-btn edit-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Registration
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {isEditing && (
                       <button 
                         className="secondary-btn" 
                         onClick={() => {
                           setIsEditing(false);
                           setSelectedCourseIds(userData?.me?.registeredCourses?.map((c: any) => c.id) || []);
                         }}
                         style={{ flex: 1 }}
                       >
                         Cancel
                       </button>
                    )}
                    <button 
                      className="primary-btn submit-btn"
                      disabled={selectedCourses.length === 0 || isOverLimit || isUnchanged || isSubmitting}
                      onClick={handleSubmit}
                      style={{ flex: 2 }}
                    >
                      {isSubmitting ? 'Saving...' : (isAlreadyRegistered ? 'Save Changes' : 'Submit Registration')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}