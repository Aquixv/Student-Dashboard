import { useQuery, useMutation } from '@apollo/client/react';
import { usePaystackPayment } from 'react-paystack';
import { GET_ME } from '../graphql/queries';
import { UPDATE_FEE_STATUS } from '../graphql/mutations';
import './SchoolFees.css';
import type { GetMeResponse } from '../types';

export default function SchoolFees() {
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

              <div className="invoice-footer">
                {/* 3. Wire the button to initialize Paystack */}
                <button 
                  className="primary-btn pay-fees-btn" 
                  onClick={() => initializePayment({ onSuccess, onClose })}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating Portal...' : 'Pay ₦140,000 via Paystack'}
                </button>
                <span className="secure-note">🔒 Secured by Paystack Checkout</span>
              </div>
            </>
          ) : (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
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
                <button className="download-receipt-btn">⬇ PDF</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}