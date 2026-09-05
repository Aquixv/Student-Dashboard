import './Home.css';

export default function Home() {
  return (
    <div className="dashboard-container">
      <div className="fees-header">
        <h2>Welcome, User</h2>
      </div>
      <div className="stats-grid">
        <div className="stat-card alert">
          <h3>Outstanding Balance</h3>
          <p className="stat-value text-red">₦15,000</p>
          <span className="stat-subtitle">Due in 5 days</span>
        </div>
        <div className="stat-card">
          <h3>Registered Units</h3>
          <p className="stat-value">18 <span className="stat-max">/ 24</span></p>
          <span className="stat-subtitle">Current Semester</span>
        </div>
        <div className="stat-card">
          <h3>Academic Term</h3>
          <p className="stat-value text-sm">Harmattan 2026</p>
          <span className="stat-subtitle">Week 4 of 12</span>
        </div>
        <div className="stat-card">
          <h3>Academic Advisor</h3>
          <p className="stat-value text-sm">Alamu.O</p>
          <span className="stat-subtitle">Computer Science Dept.</span>
        </div>
      </div>

      <div className="dashboard-main-split">
        
        <div className="content-card fees-section">
          <div className="card-header">
            <h2>Current Fee </h2>
            <button className="text-link">View History</button>
          </div>
          
          <div className="fee-list">
            <div className="fee-item settled">
              <div>
                <h4>Tuition Fee</h4>
                <p>100 Level</p>
              </div>
              <div className="fee-status">
                <span className="amount">₦120,000</span>
                <span className="badge badge-paid">Paid</span>
              </div>
            </div>
            
            <div className="fee-item pending">
              <div>
                <h4>ICT & Lab Levy</h4>
                <p>Compulsory</p>
              </div>
              <div className="fee-status">
                <span className="amount">₦15,000</span>
                <span className="badge badge-unpaid">Pending</span>
              </div>
            </div>
          </div>

          <div className="card-action-bar">
            <button className="primary-btn">Proceed to Pay ₦15,000</button>
          </div>
        </div>

        {/* Right Column: Receipts */}
        <div className="content-card receipts-section">
          <div className="card-header">
            <h2>Recent Receipts</h2>
          </div>
          <div className="receipt-list">
            <div className="receipt-item">
              <div className="receipt-info">
                <h4>Invoice #1042</h4>
                <p>Tuition • Aug 15, 2026</p>
              </div>
              <button className="download-btn">⬇</button>
            </div>
            <div className="receipt-item">
              <div className="receipt-info">
                <h4>Invoice #0981</h4>
                <p>Acceptance • Jul 20, 2026</p>
              </div>
              <button className="download-btn">⬇</button>
            </div>
          </div>
        </div>
        
      </div>

      {/* Bottom Banner */}
      <div className="action-banner">
        <div className="banner-content">
          <h3>Registration Deadline Approaching</h3>
          <p>Pay your outstanding fees to unlock the course registration portal for the Harmattan semester.</p>
        </div>
        <button className="secondary-btn">Go to Registration</button>
      </div>
    </div>
  );
}