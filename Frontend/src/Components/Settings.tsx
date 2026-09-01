import './Results.css';

export default function Settings() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h2>Account Settings</h2>
        <p>Update your preferences and security settings.</p>
      </div>

      <div className="content-card settings-form">
        <h3 className="card-title">Change Password</h3>
        <div className="input-group">
          <label>Current Password</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <div className="input-group">
          <label>New Password</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <button className="primary-btn-sm" style={{ width: 'max-content' }}>
          Update
        </button>
      </div>
    </div>
  );
}