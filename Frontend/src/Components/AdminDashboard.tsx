import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { useLazyQuery } from '@apollo/client/react';
import { GET_STUDENT_BY_MATRIC } from '../graphql/queries';
import { ADD_COURSE } from '../graphql/mutations';
import { GET_AVAILABLE_COURSES } from '../graphql/queries';
import { GET_BILLS } from '../graphql/queries';
import { UPLOAD_RESULT } from '../graphql/mutations';
import { GET_STUDENTS } from '../graphql/queries';
import { UPDATE_DEPARTMENT } from '../graphql/mutations';
import { ADD_BILL, DELETE_BILL } from '../graphql/mutations';
import './secondaryPages.css'; 
import type { GetBillsResponse, GetStudentByMatricResponse, GetStudentsResponse } from '../types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'COURSES' | 'RESULTS' | 'BILLING' | 'STUDENTS'>('COURSES');
  const { data } = useQuery<GetStudentsResponse>(GET_STUDENTS);
  const [searchMatric, setSearchMatric] = useState('');
const [fetchStudent, { data: searchData, loading: searchLoading, error: searchError }] = useLazyQuery<GetStudentByMatricResponse>(GET_STUDENT_BY_MATRIC);

const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  const input = searchMatric.trim();
  
  if (input) {
    const formattedMatric = input.length === 4 && !input.startsWith('OND') 
      ? `OND/PROF/${input}` 
      : input;
      
    fetchStudent({ variables: { matricNumber: formattedMatric } });
  }
};
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

const [uploadResult, {}] = useMutation(UPLOAD_RESULT, {
  onCompleted: () => {
    // Just a silent confirmation for the console, no intrusive alerts!
    console.log('Grade auto-saved successfully.');
  },
  onError: (err) => {
    // Only alert if something actually goes wrong
    alert(`Failed to save grade: ${err.message}`);
  }
});

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

        {/* --- STUDENTS TAB (Now with Search!) --- */}
        {activeTab === 'STUDENTS' && (
          <div>
            <h3 style={{ color: '#2b3674', marginBottom: '0.5rem' }}>Student Mapper</h3>
            <p style={{ color: '#718096', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Search for a student to assign their academic department.</p>

            {/* Reusing the exact same search bar from the Results tab */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '2rem', maxWidth: '500px' }}>
              <input 
                type="text" 
                placeholder="Enter Last 4 Digits (e.g. 1234)"
                value={searchMatric}
                onChange={(e) => setSearchMatric(e.target.value)}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                required
              />
              <button type="submit" className="primary-btn" disabled={searchLoading}>
                {searchLoading ? 'Searching...' : 'Search'}
              </button>
            </form>

            {searchError && <p style={{ color: '#ef4444' }}>Error: {searchError.message}</p>}

            {searchData?.getStudentByMatric === null && !searchLoading && (
              <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center', color: '#64748b' }}>
                No student found with that matriculation number.
              </div>
            )}

            {searchData?.getStudentByMatric && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, color: '#2b3674' }}>{searchData.getStudentByMatric.fullName}</h4>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                    {searchData.getStudentByMatric.matricNumber} • <span style={{ color: '#16a34a' }}>Found</span>
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    placeholder="e.g. Computer Science"
                    defaultValue={searchData.getStudentByMatric.department || ''}
                    onBlur={(e) => {
                      if (e.target.value !== searchData.getStudentByMatric!.department) {
                        updateDept({ variables: { userId: searchData.getStudentByMatric!.id, department: e.target.value } });
                      }
                    }}
                    style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', width: '250px' }}
                  />
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>*Auto-saves</span>
                </div>
              </div>
            )}
          </div>
        )}
        {/* --- RESULTS TAB --- */}
        {activeTab === 'RESULTS' && (
          <div>
            <h3 style={{ color: '#2b3674', marginBottom: '0.5rem' }}>Upload Academic Result</h3>
            <p style={{ color: '#718096', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Search for a student to view and grade their registered courses.</p>
            
            {/* 1. The Search Bar */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '2rem', maxWidth: '500px' }}>
              <input 
  type="text" 
  placeholder="Enter Last 4 Digits (e.g. 1234)"
  value={searchMatric}
  onChange={(e) => setSearchMatric(e.target.value)}
  style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
  required
/>
              <button type="submit" className="primary-btn" disabled={searchLoading}>
                {searchLoading ? 'Searching...' : 'Search'}
              </button>
            </form>

            {searchError && <p style={{ color: '#ef4444' }}>Error: {searchError.message}</p>}

            {/* 2. The Grading Interface (Only shows if a student is found) */}
            {searchData?.getStudentByMatric === null && !searchLoading && (
              <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center', color: '#64748b' }}>
                No student found with that matriculation number.
              </div>
            )}

            {searchData?.getStudentByMatric && (
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                
                {/* Student Bio Header */}
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#2b3674', fontSize: '1.2rem' }}>
                    {searchData.getStudentByMatric.fullName}
                  </h4>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                    {searchData.getStudentByMatric.matricNumber} • {searchData.getStudentByMatric.department || 'No Department Assigned'}
                  </p>
                </div>

                {/* Course Grading List */}
                <div style={{ padding: '1.5rem' }}>
                  <h5 style={{ marginTop: 0, color: '#4a5568', marginBottom: '1rem' }}>Registered Courses</h5>
                  
                  {searchData.getStudentByMatric.registeredCourses.length === 0 ? (
                    <p style={{ color: '#a0aec0', fontSize: '0.9rem' }}>This student has not registered for any courses.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {searchData.getStudentByMatric.registeredCourses.map((course: any) => (
                        <div key={course.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px dashed #e2e8f0' }}>
                          
                          <div>
                            <strong style={{ display: 'block', color: '#2b3674' }}>{course.code}</strong>
                            <span style={{ fontSize: '0.85rem', color: '#718096' }}>{course.title}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4a5568' }}>Score:</label>
                            <input 
                              type="number" 
                              min="0" max="100"
                              placeholder="0"
                              onBlur={(e) => {
                                const val = e.target.value;
                                if (val !== '') {
                                  // Fire the auto-save mutation when they click away!
                                  uploadResult({ 
                                    variables: { 
                                      matricNumber: searchData?.getStudentByMatric?.matricNumber, 
                                      courseCode: course.code, 
                                      score: Number(val) 
                                    } 
                                  });
                                }
                              }}
                              style={{ width: '80px', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', textAlign: 'center' }}
                            />
                          </div>

                        </div>
                      ))}
                      <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#16a34a' }}>✓ Scores auto-save on entry</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}