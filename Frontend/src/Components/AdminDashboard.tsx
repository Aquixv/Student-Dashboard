import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { ADD_COURSE } from '../graphql/mutations';
import { GET_AVAILABLE_COURSES } from '../graphql/queries';
import { GET_BILLS } from '../graphql/queries';
import { GET_STUDENTS } from '../graphql/queries';
import { UPDATE_DEPARTMENT } from '../graphql/mutations';
import { ADD_BILL, DELETE_BILL } from '../graphql/mutations';
import './secondaryPages.css'; 
import type { GetBillsResponse, GetStudentsResponse } from '../types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'COURSES' | 'RESULTS' | 'BILLING' | 'STUDENTS'>('COURSES');
  const { data: studentsData, loading: studentsLoading, error: studentsError } = useQuery<GetStudentsResponse>(GET_STUDENTS);
const [updateDept] = useMutation(UPDATE_DEPARTMENT, {
  onError: (err) => {
    console.error("Mutation Failed:", err.message);
    alert(`Failed to save: ${err.message}`);
  },
  onCompleted: () => {
    console.log("Department saved successfully!");
  }
});
  const { data: billsData } = useQuery<GetBillsResponse>(GET_BILLS);
const [addBill] = useMutation(ADD_BILL, { refetchQueries: [{ query: GET_BILLS }] });
const [deleteBill] = useMutation(DELETE_BILL, { refetchQueries: [{ query: GET_BILLS }] });

const [billDesc, setBillDesc] = useState('');
const [billAmount, setBillAmount] = useState('');

  const [courseData, setCourseData] = useState({
    code: '',
    title: '',
    units: 3,
    type: 'Compulsory'
  });

  const [addCourse, { loading, error }] = useMutation(ADD_COURSE, {
    // This tells Apollo to refresh the course list in the background
    refetchQueries: [{ query: GET_AVAILABLE_COURSES }],
    onCompleted: () => {
      // Reset the form on success
      setCourseData({ code: '', title: '', units: 3, type: 'Compulsory' });
      alert('Course successfully added to the catalog!');
    }
  });

const handleAddBill = (e: React.FormEvent) => {
  e.preventDefault();
  addBill({ variables: { description: billDesc, amount: Number(billAmount) } });
  setBillDesc('');
  setBillAmount('');
};

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    addCourse({
      variables: {
        code: courseData.code,
        title: courseData.title,
        units: Number(courseData.units),
        type: courseData.type
      }
    });
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h2>Admin Control Panel</h2>
        <p>Manage portal records, academic results, and course catalogs.</p>
      </div>

      {/* Modernized Tab Navigation */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ 
          display: 'inline-flex', 
          background: '#f1f5f9', 
          padding: '0.4rem', 
          borderRadius: '10px',
          gap: '0.5rem',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <button 
            onClick={() => setActiveTab('COURSES')}
            style={{
              padding: '0.6rem 1.5rem', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease',
              background: activeTab === 'COURSES' ? 'white' : 'transparent',
              color: activeTab === 'COURSES' ? '#095DC5' : '#64748b',
              boxShadow: activeTab === 'COURSES' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            📚 Manage Courses
          </button>
          
          <button 
            onClick={() => setActiveTab('BILLING')}
            style={{
              padding: '0.6rem 1.5rem', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease',
              background: activeTab === 'BILLING' ? 'white' : 'transparent',
              color: activeTab === 'BILLING' ? '#095DC5' : '#64748b',
              boxShadow: activeTab === 'BILLING' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            💳 Billing Config
          </button>
          <button 
            onClick={() => setActiveTab('STUDENTS')}
            style={{
              padding: '0.6rem 1.5rem', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease',
              background: activeTab === 'STUDENTS' ? 'white' : 'transparent',
              color: activeTab === 'STUDENTS' ? '#095DC5' : '#64748b',
              boxShadow: activeTab === 'STUDENTS' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            🧑‍🎓 Student Mapper
          </button>
          <button 
            onClick={() => setActiveTab('RESULTS')}
            style={{
              padding: '0.6rem 1.5rem', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease',
              background: activeTab === 'RESULTS' ? 'white' : 'transparent',
              color: activeTab === 'RESULTS' ? '#095DC5' : '#64748b',
              boxShadow: activeTab === 'RESULTS' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            📊 Upload Results
          </button>
        </div>
      </div>
      <div className="content-card" style={{ padding: '2rem' }}>
        {activeTab === 'COURSES' && (
          <div>
            <h3 style={{ color: '#2b3674', marginBottom: '0.5rem' }}>Add New Course</h3>
            <p style={{ color: '#718096', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Push a new course to the registration catalog.</p>
            
            {error && <p style={{ color: 'red', marginBottom: '1rem' }}>Error: {error.message}</p>}
            
            <form onSubmit={handleAddCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Course Code (e.g. MTH 101)</label>
                <input 
                  type="text" required
                  value={courseData.code}
                  onChange={e => setCourseData({...courseData, code: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Course Title</label>
                <input 
                  type="text" required
                  value={courseData.title}
                  onChange={e => setCourseData({...courseData, title: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Units</label>
                  <input 
                    type="number" required min="1" max="6"
                    value={courseData.units}
                    onChange={e => setCourseData({...courseData, units: Number(e.target.value)})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                  />
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Type</label>
                  <select 
                    value={courseData.type}
                    onChange={e => setCourseData({...courseData, type: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: 'white' }}
                  >
                    <option value="Compulsory">Compulsory</option>
                    <option value="Elective">Elective</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="primary-btn" 
                disabled={loading}
                style={{ marginTop: '1rem' }}
              >
                {loading ? 'Adding Course...' : 'Add Course to Catalog'}
              </button>
            </form>
          </div>
        )}
        
{activeTab === 'BILLING' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ color: '#2b3674', marginBottom: '0.5rem' }}>Semester Billing Configuration</h3>
                <p style={{ color: '#718096', fontSize: '0.9rem' }}>Configure the mandatory fee breakdown for all students.</p>
              </div>
              <button 
                className="primary-btn" 
                style={{ backgroundColor: '#16a34a', border: 'none' }}
                onClick={() => alert('Semester fees have been published to all student portals!')}
              >
                📢 Publish Fees
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {/* Left Column: Form */}
              <form onSubmit={handleAddBill} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ marginBottom: '1rem', color: '#2b3674' }}>Add Fee Item</h4>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Fee Description</label>
                  <input 
                    type="text" required placeholder="e.g. Health & Clinic Fee"
                    value={billDesc} onChange={e => setBillDesc(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Amount (₦)</label>
                  <input 
                    type="number" required placeholder="15000"
                    value={billAmount} onChange={e => setBillAmount(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                  />
                </div>
                <button type="submit" className="secondary-btn" style={{ width: '100%' }}>+ Add to Invoice</button>
              </form>

              {/* Right Column: Live List */}
              <div>
                <h4 style={{ marginBottom: '1rem', color: '#2b3674' }}>Current Invoice Structure</h4>
                {billsData?.getBills?.length === 0 ? (
                  <p style={{ color: '#a0aec0', fontSize: '0.9rem' }}>No fees configured yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {billsData?.getBills.map((bill: any) => (
                      <div key={bill.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                        <div>
                          <strong style={{ display: 'block', color: '#2b3674', fontSize: '0.95rem' }}>{bill.description}</strong>
                          <span style={{ color: '#718096', fontSize: '0.9rem' }}>₦{bill.amount.toLocaleString()}</span>
                        </div>
                        <button 
                          onClick={() => deleteBill({ variables: { id: bill.id } })}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'STUDENTS' && (
          <div>
            <h3 style={{ color: '#2b3674', marginBottom: '0.5rem' }}>Student Mapper</h3>
            <p style={{ color: '#718096', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Assign academic departments to registered matriculation numbers.</p>

            {/* Error and Loading Handlers */}
            {studentsLoading && <p style={{ color: '#095DC5', padding: '1rem' }}>⏳ Fetching registered students...</p>}
            {studentsError && <p style={{ color: '#ef4444', padding: '1rem', background: '#fee2e2', borderRadius: '6px' }}>❌ Database Error: {studentsError.message}</p>}

            {!studentsLoading && !studentsError && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {studentsData?.getStudents?.map((student: any) => (
                  <div key={student.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, color: '#2b3674' }}>{student.fullName}</h4>
                      <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                        {student.matricNumber || 'No Matric Number'} • <span style={{ color: student.hasPaidFees ? '#16a34a' : '#ef4444' }}>{student.hasPaidFees ? 'Cleared' : 'Owing'}</span>
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        placeholder="e.g. Computer Science"
                        defaultValue={student.department || ''}
                        onBlur={(e) => {
                          if (e.target.value !== student.department) {
                            updateDept({ variables: { userId: student.id, department: e.target.value } });
                          }
                        }}
                        style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', width: '250px' }}
                      />
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>*Auto-saves on click away</span>
                    </div>
                    
                  </div>
                ))}
                
                {/* Fallback if the array is actually empty */}
                {(!studentsData?.getStudents || studentsData.getStudents.length === 0) && (
                  <p style={{ color: '#a0aec0', textAlign: 'center', padding: '2rem', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
                    No registered students found in the database.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        {activeTab === 'RESULTS' && (
          <div>
            <h3 style={{ color: '#2b3674', marginBottom: '0.5rem' }}>Upload Academic Result</h3>
            <p style={{ color: '#718096', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Bind a final grade to a student's matriculation number.</p>
            {/* Upload Result Form will go here next */}
          </div>
        )}
      </div>
    </div>
  );
}