import { useQuery, useMutation } from '@apollo/client/react';
import { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { GET_ME, GET_BILLS } from '../graphql/queries';
import { UPDATE_FEE_STATUS, SUBMIT_PAYMENT_PROOF } from '../graphql/mutations';
import './SchoolFees.css';
import type { GetBillsResponse, GetMeResponse } from '../types';
import { downloadReceipt } from '../utils/generateReceipts';

export default function SchoolFees() {
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'remita' | 'transfer'>('paystack');
  const { data, loading } = useQuery<GetMeResponse>(GET_ME);
  const { data: billsData } = useQuery<GetBillsResponse>(GET_BILLS);
  
  const [updateFeeStatus, { loading: isUpdating }] = useMutation(UPDATE_FEE_STATUS, {
    refetchQueries: [{ query: GET_ME }] 
  });

  // --- NEW: Cloudinary Upload State & Mutation ---
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [submitProof] = useMutation(SUBMIT_PAYMENT_PROOF);

  if (loading) return <div className="fees-wrapper">Loading financial records...</div>;

  const user = data?.me;
  const hasPaidFees = user?.hasPaidFees || false;
  const bills = billsData?.getBills || [];
  const totalAmount = bills.reduce((sum: number, bill: any) => sum + bill.amount, 0);

  // --- 1. Paystack Logic ---
  const paystackConfig = {
    reference: `INV-${new Date().getTime()}`,
    email: user?.email || 'student@eduportal.edu.ng',
    amount: totalAmount * 100, 
    publicKey: 'pk_test_aed41b8546b5826ba7e2d0c06029c6acc73ccbfa', 
    metadata: {
      custom_fields: [{
        display_name: "Matric Number",
        variable_name: "matric_number",
        value: user?.matricNumber || "Pending"
      }]
    }
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const onSuccess = async (reference: any) => {
    try {
      await updateFeeStatus({ variables: { userId: user?.id, status: true, reference: reference.reference } });
    } catch (error) {
      console.error('Failed to update database:', error);
    }
  };

  const onClose = () => console.log('Payment window closed.');

  // --- 2. Receipt Download Logic ---
  const handleDownloadSessionReceipt = () => {
    if (!user) return;
    const dynamicItems = bills.map((bill: any) => ({ desc: bill.description, amount: bill.amount.toLocaleString() }));
    const invoiceDetails = {
      reference: `INV-2026-${user.matricNumber?.replace(/\//g, '') || 'NEW'}`,
      date: new Date().toLocaleDateString(),
      total: totalAmount.toLocaleString(),
      items: dynamicItems
    };
    downloadReceipt(user, invoiceDetails);
  };

  const handleDownloadAcceptanceReceipt = () => {
    if (!user) return;
    downloadReceipt(user, {
      reference: 'INV-1042',
      date: 'Aug 15, 2026',
      total: '50,000',
      items: [{ desc: 'Acceptance Fee', amount: '50,000' }]
    });
  };

  // --- 3. Cloudinary Upload Logic ---
  const handleUpload = async () => {
    if (!file) return alert('Please select a receipt image first.');
    if (!user?.id) return alert('User data missing.');
    
    setIsUploading(true);
const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    try {
      const formData = new FormData();
      formData.append('upload_preset', uploadPreset);
      formData.append('cloud_name', cloudName);
      // REMEMBER TO SWAP THIS WITH YOUR ACTUAL PRESET

      // REMEMBER TO SWAP 'YOUR_CLOUD_NAME' WITH YOUR ACTUAL CLOUD NAME
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const uploadData = await res.json();

      if (!uploadData.secure_url) throw new Error('Upload failed');

      await submitProof({ 
        variables: { userId: user.id, proofUrl: uploadData.secure_url } 
      });

      alert('Receipt uploaded successfully! Awaiting admin verification.');
      setFile(null); // Clear the file input
    } catch (error) {
      alert('Error uploading receipt. Please try again.');
    } finally {
      setIsUploading(false);
    }
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
              {hasPaidFees ? '₦0' : `₦${totalAmount.toLocaleString()}`}
            </span>
          </div>

          {!hasPaidFees ? (
            <>
              <div className="invoice-list">
                {bills.length === 0 ? (
                  <p style={{ padding: '1rem', color: '#718096' }}>No fees have been set for this session yet.</p>
                ) : (
                  bills.map((bill: any) => (
                    <div className="invoice-item" key={bill.id}>
                      <div className="item-details">
                        <h4>{bill.description}</h4>
                        <p>Mandatory Session Fee</p>
                      </div>
                      <span className="item-amount">₦{bill.amount.toLocaleString()}</span>
                    </div>
                  ))
                )}
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
                      <img style={{ height: '30px', width:'50px', objectFit: 'contain' }} src="https://tse4.mm.bing.net/th/id/OIP.5YMLaME3IM0xOl1sn6unmgHaEH?r=0&w=900&h=500&rs=1&pid=ImgDetMain&o=7&rm=3" alt="Paystack" />
                    </button>
                    <button 
                      className={`secondary-btn ${paymentMethod === 'remita' ? 'active-tab' : ''}`}
                      onClick={() => setPaymentMethod('remita')}
                      style={{ flex: 1, border: paymentMethod === 'remita' ? '2px solid #095DC5' : '1px solid #e2e8f0' }}
                    >
                      <img style={{ height: '30px', width:'50px', objectFit: 'contain' }} src="https://th.bing.com/th/id/OIP.wLvyScRGylVVkuG_m835cAHaEM?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3" alt="Remita" />
                    </button>
                    <button 
                      className={`secondary-btn ${paymentMethod === 'transfer' ? 'active-tab' : ''}`}
                      onClick={() => setPaymentMethod('transfer')}
                      style={{ flex: 1, border: paymentMethod === 'transfer' ? '2px solid #095DC5' : '1px solid #e2e8f0' }}
                    >
                      <img style={{ height: '30px', width:'50px', objectFit: 'contain' }} src="https://www.svgrepo.com/show/382937/bank-capital-office-building-law-add.svg" alt="Bank Transfer" />
                    </button>
                  </div>
                </div>

                {paymentMethod === 'paystack' && (
                  <div>
                    <button 
                      className="primary-btn pay-fees-btn" 
                      onClick={() => initializePayment({ onSuccess, onClose })}
                      disabled={isUpdating || bills.length === 0}
                    >
                      {isUpdating ? 'Updating Portal...' : `Pay via Paystack`}
                    </button>
                    <div style={{ textAlign: 'center' }}><span className="secure-note"> Secured by Paystack</span></div>
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
                  <div style={{ background: '#eff6ff', padding: '1.25rem', borderRadius: '8px', border: '1px dashed #93c5fd' }}>
                    <h4 style={{ color: '#1e3a8a', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Manual Bank Transfer</h4>
                    <p style={{ fontSize: '0.85rem', color: '#1e3a8a', marginBottom: '0.3rem' }}><strong>Bank:</strong> First Bank Nigeria</p>
                    <p style={{ fontSize: '0.85rem', color: '#1e3a8a', marginBottom: '0.3rem' }}><strong>Account Name:</strong> EduPortal Fees Collection</p>
                    <p style={{ fontSize: '0.85rem', color: '#1e3a8a', marginBottom: '1rem' }}><strong>Account Number:</strong> 1234567890</p>
                    
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <h5 style={{ margin: '0 0 0.5rem 0', color: '#4a5568', fontSize: '0.85rem' }}>Upload Proof of Payment</h5>
                      <div style={{ marginBottom: '1.25rem', width: '100%' }}>
  <label 
    htmlFor="receipt-upload" 
    style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem 1rem', 
      border: '2px dashed #cbd5e1', 
      borderRadius: '8px', 
      backgroundColor: file ? '#eff6ff' : '#f8fafc', 
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'center'
    }}
  >
    {/* Optional: Drop a small SVG or emoji here */}
    <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
      {file ? <img style={{width:'50px', height:'50px'}} src="https://www.svgrepo.com/show/525265/check-circle.svg" alt="Checkmark" /> : <img style={{width:'50px', height:'50px'}} src="https://www.svgrepo.com/show/533441/receipt-alt-1.svg" alt="Receipt" />}
    </span>
    
    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: file ? '#095DC5' : '#475569' }}>
      {file ? file.name : ' select receipt image'}
    </span>
    
    {!file && (
      <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.3rem' }}>
        JPEG or PNG (Max 5MB)
      </span>
    )}
  </label>

  {/* The actual input is hidden, but the label triggers it via htmlFor */}
  <input 
    id="receipt-upload"
    type="file" 
    accept="image/png, image/jpeg" 
    onChange={(e) => setFile(e.target.files?.[0] || null)} 
    style={{ display: 'none' }} 
  />
</div>
                      <button 
                        className="primary-btn" 
                        style={{ width: '100%', background: isUploading ? '#cbd5e1' : '#095DC5', border: 'none', cursor: isUploading ? 'not-allowed' : 'pointer' }}
                        onClick={handleUpload}
                        disabled={isUploading}
                      >
                        {isUploading ? 'Uploading...' : 'Submit Receipt'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ color: '#2b3674', fontSize: '1.2rem', marginBottom: '0.5rem' }}>All Mandatory Fees Cleared</h3>
              <p style={{ color: '#718096', fontSize: '0.95rem' }}>You have no outstanding balance for the current academic session.</p>
            </div>
          )}
        </div>

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
                  <p>HM-2026 - Current</p>
                </div>
                <div className="history-actions">
                  <span className="history-amount">{totalAmount.toLocaleString()}</span>
                  <button onClick={handleDownloadSessionReceipt} className="download-receipt-btn"><img style={{ height: '20px', width:'20px'}} src="https://www.svgrepo.com/show/507665/download.svg" alt="" /></button>
                </div>
              </div>
            )}
            <div className="history-item">
              <div className="history-icon">✓</div>
              <div className="history-details">
                <h4>Acceptance Fee</h4>
                <p>Aug 15, 2026</p>
              </div>
              <div className="history-actions">
                <span className="history-amount">₦50,000</span>
                <button onClick={handleDownloadAcceptanceReceipt} className="download-receipt-btn"><img style={{ height: '20px', width:'20px'}} src="https://www.svgrepo.com/show/507665/download.svg" alt="" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}