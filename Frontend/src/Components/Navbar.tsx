import './Navbar.css';

export default function Navbar() {
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
          <div className="avatar">JD</div>
          <span>John Doe</span>
        </div>
      </div>
    </header>
  );
}