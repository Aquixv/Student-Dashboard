import './Navbar.css';
import { useQuery } from '@apollo/client/react';
import { GET_ME, GET_MY_NOTIFICATIONS } from '../graphql/queries';
import { useNavigate } from 'react-router-dom';
import type { GetMeResponse, GetMyNotificationsResponse } from '../types';
import { useState, useRef, useEffect } from 'react';

export default function Navbar(){
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { data: notifData, loading: notifLoading } = useQuery<GetMyNotificationsResponse>(GET_MY_NOTIFICATIONS);
const notifications = notifData?.getMyNotifications || [];
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const { data, loading, error } = useQuery<GetMeResponse>(GET_ME);
  const navigate = useNavigate()
  const displayName = data?.me?.fullName || 'Student';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  return (
    <header className="topbar">
      <div className="topbar-title">
      </div>
      
      <div className="topbar-actions">
        {/* <button className="status-btn">
          <span style={{ fontSize: '1.1rem' }}></span> Status
        </button> */}
        
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
         <span style={{ position: 'absolute', top: '0', right: '0', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid white' }}></span>
        {notifications.length > 0 &&<span style={{ position: 'absolute', top: '0', background: '#ef4444', right: '0', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid white' }}></span>}
          </button>
         {showNotifs && (
  <div className='drop'>
    <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h4 style={{ margin: 0, color: '#1e293b' }}>Notifications</h4>
      <span onClick={() => setShowNotifs(false)} style={{ fontSize: '0.8rem', color: '#095DC5', cursor: 'pointer', fontWeight: 600 }}>Close</span>
    </div>
    
    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
      {notifLoading ? (
        <p style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem', margin: 0 }}>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>No new alerts.</p>
      ) : (
        notifications.map((notif: any) => (
          <div key={notif.id} style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', background: 'white', transition: 'background 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              
              <strong style={{ fontSize: '0.9rem', color: notif.isGlobal ? '#095DC5' : '#e53e3e' }}>
                {/* {notif.isGlobal ? 'Announcement' : 'Payment Update'} */}
              </strong>
              
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {/* Converts standard GraphQL timestamp to "Oct 3" format */}
                {new Date(Number(notif.createdAt)).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
              
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
              {notif.message}
            </p>
          </div>
        ))
      )}
    </div>
  </div>
)}
        </div>
        <div onClick={() => navigate("/profile")} className="profile-widget">
          <div className="avatar" style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {loading ? (
              '...'
            ) : data?.me?.avatar && data.me.avatar.startsWith('http') ? (
              <img 
                src={data.me.avatar} 
                alt="Profile" 
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