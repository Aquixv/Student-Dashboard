import { NavLink, useNavigate} from 'react-router-dom';
import { useApolloClient } from '@apollo/client/react';
import './Sidebar.css';

export default function Sidebar() {

  const navigate = useNavigate();
  const client = useApolloClient();

  const handleLogout = () => {
    localStorage.removeItem('portal_token');
    client.clearStore();
    
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
         <span>EPortal</span>
      </div>
      
      <div className="nav-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Dashboard
        </NavLink>
        
        <NavLink 
          to="/fees" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          School Fees
        </NavLink>
        
        <NavLink 
          to="/registration" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Course Registration
        </NavLink>
        
        <NavLink 
          to="/timetable" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Timetable
        </NavLink>
        
        <NavLink 
          to="/results" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Results
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <div className="nav-links">
          <NavLink to="/profile" className="nav-item">Profile</NavLink>
          <NavLink to="/help" className="nav-item">Help</NavLink>
          <NavLink to="/settings" className="nav-item">Settings</NavLink>
        </div>
        <button onClick={handleLogout} className="nav-item logout-btn">
            Log Out
          </button>
      </div>
    </aside>
  );
}