import './Navbar.css';

export default function Navbar() {
  return (
    <header className="topbar">
      <div className="topbar-title">
        Dashboard
      </div>
      
      <div className="topbar-actions">
        <div className="School-Fees">
          Status
        </div>
        <div className="search-container">
          <span style={{ marginRight: '8px', color: '#a3aed1' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search here..." 
            className="search-input" 
          />
        </div>

        <div className="notification-icon">
          🔔
        </div>

        <div className="profile-widget">
          <div className="avatar">JD</div>
          <span>John Doe</span>
        </div>
      </div>
    </header>
  );
}