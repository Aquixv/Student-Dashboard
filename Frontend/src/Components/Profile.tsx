import { useQuery } from '@apollo/client/react';
import { GET_ME } from '../graphql/queries';
import './Results.css';
import type { GetMeResponse } from '../types';

export default function Profile() {
  const { data, loading, error } = useQuery<GetMeResponse>(GET_ME);

  if (loading) return <div className="page-wrapper"><div className="page-header"><h2>Loading Profile...</h2></div></div>;
  if (error) return <div className="page-wrapper"><div className="page-header"><h2 style={{ color: 'red' }}>Failed to load profile</h2></div></div>;

  const user = data?.me;
  const initials = user?.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  const registeredCourses = user?.registeredCourses || [];
  const totalUnits = registeredCourses.reduce((sum: number, course: any) => sum + course.units, 0);

  return (
    <div className="page-wrapper">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Student Profile & Course Form</h2>
          <p>Official bio-data and academic registration records.</p>
        </div>
        <button style={{ backgroundColor:'#2b3674'}}className="secondary-btn" onClick={() => window.print()}>🖨️ Print</button>
      </div>

      <div className="content-card profile-card" style={{ marginBottom: '2rem' }}>
        <div className="profile-header-banner"></div>
        <div className="profile-avatar-large">{initials}</div>
        
        <div className="profile-details-grid">
          <div className="detail-group">
            <label>Full Name</label>
            <p>{user?.fullName}</p>
          </div>
          <div className="detail-group">
            <label>Matriculation Number</label>
            <p>{user?.matricNumber || 'Pending Assignment'}</p>
          </div>
          <div className="detail-group">
            <label>Department</label>
            <p>{user?.department || 'Not Assigned'}</p>
          </div>
          <div className="detail-group">
            <label>Current Level</label>
            <p>{user?.level || '100 Level'}</p>
          </div>
          <div className="detail-group">
            <label>Email Address</label>
            <p>{user?.email}</p>
          </div>
          <div className="detail-group">
            <label>Financial Status</label>
            <p style={{ color: user?.hasPaidFees ? 'green' : 'red', fontWeight: 'bold' }}>
              {user?.hasPaidFees ? 'Cleared' : 'Outstanding Balance'}
            </p>
          </div>
        </div>
      </div>

      {/* NEW: The Printable Registered Courses Section */}
      <div className="content-card">
        <div className="card-header" style={{ padding: '1.5rem', borderBottom: '1px solid #edf2f7' }}>
          <h3 style={{color: '#2b3674'}}>Registered Courses (Harmattan Semester)</h3>
        </div>
        
        {registeredCourses.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#718096' }}>
            No courses registered for this semester yet.
          </div>
        ) : (
          <div style={{ padding: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#4a5568' }}>
                  <th style={{ padding: '12px 8px' }}>Course Code</th>
                  <th style={{ padding: '12px 8px' }}>Course Title</th>
                  <th style={{ padding: '12px 8px' }}>Units</th>
                </tr>
              </thead>
              <tbody>
                {registeredCourses.map((course: any) => (
                  <tr key={course.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 'bold', color: '#2b3674' }}>{course.code}</td>
                    <td style={{ padding: '12px 8px', color: '#4a5568' }}>{course.title}</td>
                    <td style={{ padding: '12px 8px', color: '#4a5568' }}>{course.units}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} style={{ padding: '16px 8px', textAlign: 'right', fontWeight: 'bold' }}>Total Units:</td>
                  <td style={{ padding: '16px 8px', fontWeight: 'bold', color: '#2b3674' }}>{totalUnits}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}