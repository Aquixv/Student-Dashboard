import './SchoolFees.css';

export default function SchoolFees() {
  // Mock data for the UI
  const pendingFees = [
    { id: 1, name: 'Harmattan Tuition Fee', description: '100 Level', amount: 120000 },
    { id: 2, name: 'ICT & Lab Levy', description: 'Compulsory', amount: 15000 },
    { id: 3, name: 'Library Fee', description: 'Sessional', amount: 5000 },
  ];

  const paymentHistory = [
    { id: 'INV-1042', title: 'Acceptance Fee', date: 'Aug 15, 2026', amount: 50000, status: 'Successful' },
    { id: 'INV-0981', title: 'Application Form', date: 'Jul 20, 2026', amount: 10000, status: 'Successful' },
  ];

  // Auto-calculate the total
  const totalDue = pendingFees.reduce((sum, fee) => sum + fee.amount, 0);

  return (
    <div className="fees-wrapper">
      <div className="fees-header">
        <h2>Financial Overview</h2>
        <p>Manage your school fees, track payment history, and download receipts.</p>
      </div>

      <div className="fees-split">
        {/* Left Column: Current Invoice */}
        <div className="invoice-panel">
          <div className="invoice-header">
            <h3>Outstanding Balance</h3>
            <div className="total-due-badge">
              ₦{totalDue.toLocaleString()}
            </div>
          </div>

          <div className="invoice-list">
            {pendingFees.map((fee) => (
              <div key={fee.id} className="invoice-item">
                <div className="item-details">
                  <h4>{fee.name}</h4>
                  <p>{fee.description}</p>
                </div>
                <div className="item-amount">
                  ₦{fee.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="invoice-footer">
            <button className="primary-btn pay-fees-btn">
              Pay ₦{totalDue.toLocaleString()} Now
            </button>
            <p className="secure-note">🔒 Secured by standard payment gateways</p>
          </div>
        </div>

        {/* Right Column: Payment History */}
        <div className="history-panel">
          <div className="panel-header">
            <h3>Payment History</h3>
          </div>
          
          <div className="history-list">
            {paymentHistory.map((record) => (
              <div key={record.id} className="history-item">
                <div className="history-icon">✓</div>
                <div className="history-details">
                  <h4>{record.title}</h4>
                  <p>{record.id} • {record.date}</p>
                </div>
                <div className="history-actions">
                  <span className="history-amount">₦{record.amount.toLocaleString()}</span>
                  <button className="download-receipt-btn">⬇ PDF</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}