import './Navbar.css';
import { useQuery } from '@apollo/client/react';
import { GET_ME } from '../graphql/queries';
import type { GetMeResponse } from '../types';

export default function Navbar() {
  const { data, loading, error } = useQuery<GetMeResponse>(GET_ME);

  const displayName = data?.me?.fullName || 'Student';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <header className="topbar">
      <div className="topbar-title">
      </div>
      
      <div className="topbar-actions">
        <button className="status-btn">
          <span style={{ fontSize: '1.1rem' }}>⛙</span> Status
        </button>
        
        <div className="search-container">
          <span style={{ color: '#a3aed1', fontSize: '1.1rem' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search here..." 
            className="search-input" 
          />
        </div>

        <button className="notification-icon">
          🔔
        </button>

        <div className="profile-widget">
          <div className="avatar">{loading ? '...' : initials}</div>
          <span>{error ? 'Error' : displayName}</span>
        </div>
      </div>
    </header>
  );
}