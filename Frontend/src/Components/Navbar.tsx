import './Navbar.css';

export default function Navbar() {
  return (
    <header className="topbar">
      <div className="topbar-title">
        Portal Overview
      </div>
      
      <div className="topbar-actions">
        <input 
          type="text" 
          placeholder="Search here..." 
          className="search-input" 
        />
        <div className="notification-icon">🔔</div>
        <div className="profile-widget">
          <div className="avatar">JD</div>
          <span>John Doe</span>
        </div>
      </div>
    </header>
  );
}