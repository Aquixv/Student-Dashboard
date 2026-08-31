import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
         <span>EPortal</span>
      </div>
      
      <ul className="nav-links">
        <li className="nav-item active">Dashboard</li>
        <li className="nav-item">School Fees</li>
        <li className="nav-item">Course Registration</li>
        <li className="nav-item">Timetable</li>
        <li className="nav-item">Results</li>
      </ul>

      <div className="sidebar-footer">
        <ul className="nav-links">
          <li className="nav-item">Profile</li>
          <li className="nav-item">Settings</li>
        </ul>
      </div>
    </aside>
  );
}