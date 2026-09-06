import { useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { GET_ME } from './graphql/queries';
import './Home.css';
import type { GetMeResponse } from './types';

export default function Home() {
  const navigate = useNavigate();
  const { data, loading } = useQuery<GetMeResponse>(GET_ME);

  if (loading) return <div className="dashboard-container">Loading dashboard...</div>;

  const user = data?.me;
  const firstName = user?.fullName?.split(' ')[0] || 'Student';
  const hasPaidFees = user?.hasPaidFees || false;
  
  // Dynamically calculate units from the populated array
  const totalUnits = user?.registeredCourses?.reduce((sum: number, course: any) => sum + course.units, 0) || 0;

  return (
    <div className="dashboard-container">
      <div className="fees-header">
        <h2>Welcome, {firstName}</h2>
      </div>
      
      <div className="stats-grid">
        {/* Dynamically style the balance card based on payment status */}
        <div className={`stat-card ${!hasPaidFees ? 'alert' : ''}`}>
          <h3>Outstanding Balance</h3>
          <p className={`stat-value ${!hasPaidFees ? 'text-red' : 'text-green'}`}>
            {hasPaidFees ? '₦0' : '₦15,000'}
          </p>
          <span className="stat-subtitle">
            {hasPaidFees ? 'Fully Paid' : 'Due in 5 days'}
          </span>
        </div>
        
        <div className="stat-card">
          <h3>Registered Units</h3>
          <p className="stat-value">{totalUnits} <span className="stat-max">/ 24</span></p>
          <span className="stat-subtitle">Current Semester</span>
        </div>
        
        <div className="stat-card">
          <h3>Academic Term</h3>
          <p className="stat-value text-sm">Harmattan 2026</p>
          <span className="stat-subtitle">Week 4 of 12</span>
        </div>
        
        <div className="stat-card">
          <h3>Academic Advisor</h3>
          <p className="stat-value text-sm">Dr. Dan-star</p>
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
            
            <div className={`fee-item ${hasPaidFees ? 'settled' : 'pending'}`}>
              <div>
                <h4>ICT & Lab Levy</h4>
                <p>Compulsory</p>
              </div>
              <div className="fee-status">
                <span className="amount">₦15,000</span>
                <span className={`badge ${hasPaidFees ? 'badge-paid' : 'badge-unpaid'}`}>
                  {hasPaidFees ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          <div className="card-action-bar">
            <button 
              className="primary-btn" 
              disabled={hasPaidFees}
              onClick={() => navigate("/fees")}
            >
              {hasPaidFees ? 'All Fees Cleared' : 'Proceed to Pay ₦15,000'}
            </button>
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

      {/* Conditionally hide the registration warning if fees are paid */}
      {!hasPaidFees && (
        <div className="action-banner">
          <div className="banner-content">
            <h3>Registration Deadline Approaching</h3>
            <p>Pay your outstanding fees to unlock the course registration portal for the Harmattan semester.</p>
          </div>
          <button onClick={() => navigate("/fees")} className="secondary-btn">Pay Fees</button>
        </div>
      )}
    </div>
  );
}