import './Results.css';

export default function Profile() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h2>Student Profile</h2>
        <p>Manage your personal and academic details.</p>
      </div>

      <div className="content-card profile-card">
        <div className="profile-header-banner"></div>
        <div className="profile-avatar-large">JD</div>
        
        <div className="profile-details-grid">
          <div className="detail-group">
            <label>Full Name</label>
            <p>John Doe</p>
          </div>
          <div className="detail-group">
            <label>Matriculation Number</label>
            <p>2026/CSC/1042</p>
          </div>
          <div className="detail-group">
            <label>Department</label>
            <p>Computer Science</p>
          </div>
          <div className="detail-group">
            <label>Current Level</label>
            <p>200 Level</p>
          </div>
          <div className="detail-group">
            <label>Email Address</label>
            <p>john.doe@eduportal.edu.ng</p>
          </div>
        </div>
      </div>
    </div>
  );
}