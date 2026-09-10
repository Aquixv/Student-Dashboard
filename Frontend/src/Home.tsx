import { useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { GET_ME, GET_BILLS } from './graphql/queries';
import { downloadReceipt } from './utils/generateReceipts';
import './Home.css';
import type { GetBillsResponse, GetMeResponse } from './types';

export default function Home() {
  const navigate = useNavigate();
  
  // 1. Call all hooks safely at the very top level
  const { data, loading: userLoading } = useQuery<GetMeResponse>(GET_ME);
  const { data: billsData, loading: billsLoading } = useQuery<GetBillsResponse>(GET_BILLS);

  if (userLoading || billsLoading) return <div className="dashboard-container">Loading dashboard...</div>;

  const user = data?.me;
  const firstName = user?.fullName?.split(' ')[0] || 'Student';
  const hasPaidFees = user?.hasPaidFees || false;
  
  const bills = billsData?.getBills || [];
  const totalAmount = bills.reduce((sum: number, bill: any) => sum + bill.amount, 0);

  const handleDownloadSessionReceipt = () => {
    if (!user) return;
    
    const dynamicItems = bills.map((bill: any) => ({
      desc: bill.description,
      amount: bill.amount.toLocaleString()
    }));

    const invoiceDetails = {
      reference: `INV-2026-${user.matricNumber?.replace(/\//g, '') || 'NEW'}`,
      date: new Date().toLocaleDateString(),
      total: totalAmount.toLocaleString(),
      items: dynamicItems.length > 0 ? dynamicItems : [{ desc: 'Standard Session Fee', amount: totalAmount.toLocaleString() }]
    };
    
    downloadReceipt(user, invoiceDetails);
  };

  const totalUnits = user?.registeredCourses?.reduce((sum: number, course: any) => sum + course.units, 0) || 0;

  return (
    <div className="dashboard-container">
      <div className="fees-header">
        <h2>Welcome, {firstName}</h2>
      </div>
      
      <div className="stats-grid">
        <div className={`stat-card ${!hasPaidFees ? 'alert' : ''}`}>
          <h3>Outstanding Balance</h3>
          <p className={`stat-value ${!hasPaidFees ? 'text-red' : 'text-green'}`}>
            {hasPaidFees ? '₦0' : `₦${totalAmount.toLocaleString()}`}
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
            <h2>Current Fee Overview</h2>
            <button className="text-link">View History</button>
          </div>
          
          {/* 2. Dynamically render the real bills from MongoDB */}
          <div className="fee-list">
            {bills.length === 0 ? (
              <p style={{ padding: '1rem', color: '#718096' }}>No fees configured for this session yet.</p>
            ) : (
              bills.map((bill: any) => (
                <div className={`fee-item ${hasPaidFees ? 'settled' : 'pending'}`} key={bill.id}>
                  <div>
                    <h4>{bill.description}</h4>
                    <p>Mandatory Session Fee</p>
                  </div>
                  <div className="fee-status">
                    <span className="amount">₦{bill.amount.toLocaleString()}</span>
                    <span className={`badge ${hasPaidFees ? 'badge-paid' : 'badge-unpaid'}`}>
                      {hasPaidFees ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="card-action-bar">
            <button 
              className="primary-btn" 
              disabled={hasPaidFees || bills.length === 0}
              onClick={() => navigate("/fees")}
            >
              {hasPaidFees ? 'All Fees Cleared' : `Proceed to Pay ₦${totalAmount.toLocaleString()}`}
            </button>
          </div>
        </div>

        <div className="content-card receipts-section">
          <div className="card-header">
            <h2>Recent Receipts</h2>
          </div>
          <div className="receipt-list">
            {hasPaidFees && (
              <div className="receipt-item">
                <div className="receipt-info">
                  <h4>Invoice for the 2026 Session</h4>
                  <p>Session Fees</p>
                </div>
                {/* 3. Hooked up the dynamic download handler here */}
                <button className="download-btn" onClick={handleDownloadSessionReceipt}>
                  <img style={{ height: '20px', width:'20px'}} src="https://www.svgrepo.com/show/507665/download.svg" alt="Download PDF" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

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