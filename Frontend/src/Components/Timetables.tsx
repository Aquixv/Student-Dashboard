import { useState } from 'react';
import './Timetables.css';

export default function Timetable() {
  const [activeDay, setActiveDay] = useState('Monday');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const scheduleData = {
    Monday: [
      { id: 1, course: 'CSC 201', title: 'Computer Programming I', time: '08:00 AM - 10:00 AM', venue: 'Lecture Theater 1', instructor: 'Dr. Dan-star' },
      { id: 2, course: 'MTH 201', title: 'Mathematical Methods I', time: '11:00 AM - 01:00 PM', venue: 'Science Block B', instructor: 'Prof. Alamu' },
    ],
    Tuesday: [
      { id: 3, course: 'PHY 205', title: 'General Physics III', time: '09:00 AM - 11:00 AM', venue: 'Physics Lab', instructor: 'Dr. Smith' },
    ],
    Wednesday: [
      { id: 4, course: 'CSC 201', title: 'Computer Programming I (Practical)', time: '10:00 AM - 01:00 PM', venue: 'Computer Lab 3', instructor: 'Dr. Dan-star' },
      { id: 5, course: 'CSC 203', title: 'Introduction to Databases', time: '02:00 PM - 04:00 PM', venue: 'Lecture Theater 2', instructor: 'Mrs. Johnson' },
    ],
    Thursday: [],
    Friday: [
      { id: 6, course: 'MTH 201', title: 'Mathematical Methods I (Tutorial)', time: '08:00 AM - 09:00 AM', venue: 'Room 104', instructor: 'Prof. Alamu' },
    ]
  };

  const currentClasses = scheduleData[activeDay as keyof typeof scheduleData];

  return (
    <div className="timetable-wrapper">
      <div className="timetable-header">
        <h2>Class Schedule</h2>
        <p>Harmattan Semester 2026/2027</p>
      </div>

      <div className="timetable-container">
        <div className="day-selector">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              className={`day-tab ${activeDay === day ? 'active' : ''}`}
              onClick={() => setActiveDay(day)}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="schedule-list">
          {currentClasses.length === 0 ? (
            <div className="empty-schedule">
              <p>No classes scheduled for {activeDay}.</p>
            </div>
          ) : (
            currentClasses.map((session) => (
              <div key={session.id} className="session-card">
                <div className="session-main">
                  <div className="session-course-code">{session.course}</div>
                  <h4 className="session-title">{session.title}</h4>
                  <div className="session-details">
                    <span className="detail-item">
                      <span className="icon">🕒</span> {session.time}
                    </span>
                    <span className="detail-item">
                      <span className="icon">📍</span> {session.venue}
                    </span>
                    <span className="detail-item">
                      <span className="icon">👤</span> {session.instructor}
                    </span>
                  </div>
                </div>
                <div className="session-action">
                  <button className="reminder-btn" title="Set Reminder">
                    🔔
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}