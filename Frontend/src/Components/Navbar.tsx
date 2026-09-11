import './Navbar.css';
import { useQuery } from '@apollo/client/react';
import { GET_ME } from '../graphql/queries';
import { useNavigate } from 'react-router-dom';
import type { GetMeResponse } from '../types';
import { useState, useRef, useEffect } from 'react';

export default function Navbar({ user }: { user: any }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
const mockNotifications = [
    { id: 1, title: 'Portal Update', message: 'Harmattan semester registration is now open.', time: '2 hours ago', unread: true },
    { id: 2, title: 'Financial Alert', message: 'Please clear your outstanding balance to register.', time: '1 day ago', unread: true },
    { id: 3, title: 'Security', message: 'New login detected from Windows PC.', time: '3 days ago', unread: false },
  ];
  
  const { data, loading, error } = useQuery<GetMeResponse>(GET_ME);
  const navigate = useNavigate()
  const displayName = data?.me?.fullName || 'Student';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  return (
    <header className="topbar">
      <div className="topbar-title">
      </div>
      
      <div className="topbar-actions">
        <button className="status-btn">
          <span style={{ fontSize: '1.1rem' }}></span> Status
        </button>
        
        {/* <div className="search-container">
          <span style={{ color: '#a3aed1', fontSize: '1.1rem' }}><img style={{ height: '20px', width:'20px'}} src="https://www.svgrepo.com/show/532551/search-alt-1.svg" alt="" /></span>
          <input 
            type="text" 
            placeholder="Search here..." 
            className="search-input" 
          />
        </div> */}
        <div ref={notifRef} style={{ position: 'relative' }}>
        <button onClick={() => setShowNotifs(!showNotifs)} className="notification-icon">
         <img style={{ height: '20px', width:'20px'}} src="https://www.svgrepo.com/show/522617/notification.svg" alt="" />
         <span style={{ position: 'absolute', top: '0', right: '0', background: '#ef4444', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid white' }}></span>
          </button>
          {showNotifs && (
            <div style={{ position: 'absolute', top: '50px', right: '-10px', width: '320px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', zIndex: 50, overflow: 'hidden' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, color: '#1e293b' }}>Notifications</h4>
                <span style={{ fontSize: '0.8rem', color: '#095DC5', cursor: 'pointer', fontWeight: 600 }}>Mark all read</span>
              </div>
              
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {mockNotifications.map(notif => (
                  <div key={notif.id} style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', background: notif.unread ? '#f8fafc' : 'white', cursor: 'pointer', transition: 'background 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <strong style={{ fontSize: '0.9rem', color: '#1e293b' }}>{notif.title}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{notif.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4 }}>
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>
              
              <div style={{ padding: '0.75rem', textAlign: 'center', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <span style={{ fontSize: '0.85rem', color: '#095DC5', cursor: 'pointer', fontWeight: 600 }}>View all notifications</span>
              </div>
            </div>
          )}
        </div>
        <div onClick={() => navigate("/profile")} className="profile-widget">
          <div 
  className="avatar" 
  style={{ 
    width: '38px', 
    height: '38px', 
    borderRadius: '50%', 
    overflow: 'hidden', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  }}
>
  {loading ? (
    '...'
  ) : user?.avatar && !user.avatar.includes('default-avatar') ? (
    <img 
      src={user.avatar} 
      alt={user.fullName || 'User Avatar'} 
      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
    />
  ) : (
    initials
  )}
</div>
          <span>{error ? 'Error' : displayName}</span>
        </div>
      </div>
    </header>
  );
}