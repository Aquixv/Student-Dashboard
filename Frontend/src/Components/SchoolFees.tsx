import { useQuery, useMutation } from '@apollo/client/react';
import { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { GET_ME } from '../graphql/queries';
import { UPDATE_FEE_STATUS } from '../graphql/mutations';
import './SchoolFees.css';
import type { GetMeResponse } from '../types';

export default function SchoolFees() {
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'remita' | 'transfer'>('paystack');
  const { data, loading } = useQuery<GetMeResponse>(GET_ME);
  
  const [updateFeeStatus, { loading: isUpdating }] = useMutation(UPDATE_FEE_STATUS, {
    refetchQueries: [{ query: GET_ME }] 
  });

  if (loading) return <div className="fees-wrapper">Loading financial records...</div>;

  const user = data?.me;
  const hasPaidFees = user?.hasPaidFees || false;

  // 1. Configure the Paystack payload
  const paystackConfig = {
    reference: `INV-${new Date().getTime()}`,
    email: user?.email || 'student@eduportal.edu.ng',
    amount: 140000 * 100, // Paystack requires the amount in kobo
    publicKey: 'pk_test_aed41b8546b5826ba7e2d0c06029c6acc73ccbfa', // Swap this with your actual test key
    metadata: {
      custom_fields: [
        {
          display_name: "Matric Number",
          variable_name: "matric_number",
          value: user?.matricNumber || "Pending"
        }
      ]
    }
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  // 2. The callback when the payment actually succeeds
  const onSuccess = async (reference: any) => {
    try {
      await updateFeeStatus({
        variables: { 
          userId: user?.id, 
          status: true,
          reference: reference.reference // Paystack returns the ref inside an object
        }
      });
    } catch (error) {
      console.error('Failed to update database after payment:', error);
    }
  };

  const onClose = () => {
    console.log('Payment window closed by user.');
  };

  return (
    <div className="fees-wrapper">
      <div className="fees-header">
        <h2>Financial Overview</h2>
        <p>Manage your school fees, track payment history, and download receipts.</p>
      </div>

      <div className="fees-split">
        <div className="invoice-panel">
          <div className="invoice-header">
            <h3>Session Invoice</h3>
            <span className="total-due-badge">
              {hasPaidFees ? '₦0' : '₦140,000'}
            </span>
          </div>

          {!hasPaidFees ? (
            <>
              <div className="invoice-list">
                <div className="invoice-item">
                  <div className="item-details">
                    <h4>Harmattan Tuition Fee</h4>
                    <p>100 Level</p>
                  </div>
                  <span className="item-amount">₦120,000</span>
                </div>
                
                <div className="invoice-item">
                  <div className="item-details">
                    <h4>ICT & Lab Levy</h4>
                    <p>Compulsory</p>
                  </div>
                  <span className="item-amount">₦15,000</span>
                </div>

                <div className="invoice-item">
                  <div className="item-details">
                    <h4>Library Fee</h4>
                    <p>Sessional</p>
                  </div>
                  <span className="item-amount">₦5,000</span>
                </div>
              </div>

              <div className="invoice-footer" style={{ textAlign: 'left' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.9rem', color: '#4a5568', marginBottom: '0.8rem', fontWeight: 600 }}>Select Payment Method:</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className={`secondary-btn ${paymentMethod === 'paystack' ? 'active-tab' : ''}`}
                      onClick={() => setPaymentMethod('paystack')}
                      style={{ flex: 1, border: paymentMethod === 'paystack' ? '2px solid #095DC5' : '1px solid #e2e8f0' }}
                    >
                      <img style={{ height: 'max-width', width:'50px'}} src="https://tse4.mm.bing.net/th/id/OIP.5YMLaME3IM0xOl1sn6unmgHaEH?r=0&w=900&h=500&rs=1&pid=ImgDetMain&o=7&rm=3" alt="" />
                    </button>
                    <button 
                      className={`secondary-btn ${paymentMethod === 'remita' ? 'active-tab' : ''}`}
                      onClick={() => setPaymentMethod('remita')}
                      style={{ flex: 1, border: paymentMethod === 'remita' ? '2px solid #095DC5' : '1px solid #e2e8f0' }}
                    >
                      <img style={{ height: '30px', width:'50px'}} src="https://th.bing.com/th/id/OIP.wLvyScRGylVVkuG_m835cAHaEM?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3" alt="" />
                    </button>
                    <button 
                      className={`secondary-btn ${paymentMethod === 'transfer' ? 'active-tab' : ''}`}
                      onClick={() => setPaymentMethod('transfer')}
                      style={{ flex: 1, border: paymentMethod === 'transfer' ? '2px solid #095DC5' : '1px solid #e2e8f0' }}
                    >
                      <img style={{ height: '30px', width:'50px'}} src="https://www.svgrepo.com/show/382937/bank-capital-office-building-law-add.svg" alt="" />
                    </button>
                  </div>
                </div>

                {paymentMethod === 'paystack' && (
                  <div>
                    <button 
                      className="primary-btn pay-fees-btn" 
                      onClick={() => initializePayment({ onSuccess, onClose })}
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Updating Portal...' : 'Pay ₦140,000 via Paystack'}
                    </button>
                    <div style={{ textAlign: 'center' }}><span className="secure-note">🔒 Secured by Paystack</span></div>
                  </div>
                )}

                {paymentMethod === 'remita' && (
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '0.85rem', color: '#4a5568', marginBottom: '1rem' }}>
                      Click below to generate your Remita Retrieval Reference (RRR) and proceed to the Remita payment gateway.
                    </p>
                    <button 
                      className="primary-btn pay-fees-btn" 
                      style={{ backgroundColor: '#f26522', color: 'white', border: 'none' }}
                      onClick={() => alert("Mock: RRR Generated. Redirecting to Remita...")}
                    >
                      Generate RRR & Pay
                    </button>
                  </div>
                )}

                {paymentMethod === 'transfer' && (
                  <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '8px', border: '1px dashed #93c5fd' }}>
                    <h4 style={{ color: '#1e3a8a', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Manual Bank Transfer</h4>
                    <p style={{ fontSize: '0.85rem', color: '#1e3a8a', marginBottom: '0.3rem' }}><strong>Bank:</strong> First Bank Nigeria</p>
                    <p style={{ fontSize: '0.85rem', color: '#1e3a8a', marginBottom: '0.3rem' }}><strong>Account Name:</strong> EduPortal Fees Collection</p>
                    <p style={{ fontSize: '0.85rem', color: '#1e3a8a', marginBottom: '1rem' }}><strong>Account Number:</strong> 1234567890</p>
                    
                    <button 
                      className="secondary-btn" 
                      style={{ width: '100%', background: 'white', color:'#095DC5' }}
                      onClick={() => alert("Mock: Proof of payment uploaded. Awaiting admin verification.")}
                    >
                      Upload Proof of Payment
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {/* <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div> */}
              <h3 style={{ color: '#2b3674', fontSize: '1.2rem', marginBottom: '0.5rem' }}>All Mandatory Fees Cleared</h3>
              <p style={{ color: '#718096', fontSize: '0.95rem' }}>You have no outstanding balance for the current academic session.</p>
            </div>
          )}
        </div>

        {/* ... History Panel remains identical to previous code ... */}
        <div className="history-panel">
          <div className="invoice-header">
            <h3>Payment History</h3>
          </div>
          <div className="history-list">
            {hasPaidFees && (
              <div className="history-item">
                <div className="history-icon">✓</div>
                <div className="history-details">
                  <h4>Session Fees</h4>
                  <p>INV-2026 • Current</p>
                </div>
                <div className="history-actions">
                  <span className="history-amount">₦140,000</span>
                  <button className="download-receipt-btn">⬇ PDF</button>
                </div>
              </div>
            )}
            <div className="history-item">
              <div className="history-icon">✓</div>
              <div className="history-details">
                <h4>Acceptance Fee</h4>
                <p>INV-1042 • Aug 15, 2026</p>
              </div>
              <div className="history-actions">
                <span className="history-amount">₦50,000</span>
                <button className="download-receipt-btn"><img style={{ height: '20px', width:'20px'}} src="https://www.svgrepo.com/show/507665/download.svg" alt="" /> PDF</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}