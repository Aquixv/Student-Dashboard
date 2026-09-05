import { useQuery } from '@apollo/client/react';
import { GET_ME } from '../graphql/queries';
import type { GetMeResponse } from '../types';
import './Results.css';

export default function Profile() {
  const { data, loading, error } = useQuery<GetMeResponse>(GET_ME);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="page-header"><h2>Loading Profile...</h2></div>
      </div>
    );
  }

  if (error) {
    console.log(error)
    return (
      <div className="page-wrapper">
        <div className="page-header"><h2 style={{ color: 'red' }}>Failed to load profile</h2></div>
      </div>
    );
  }

  const user = data?.me;
  const initials = user?.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h2>Student Profile</h2>
        <p>Manage your personal and academic details.</p>
      </div>

      <div className="content-card profile-card">
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
        </div>
      </div>
    </div>
  );
}