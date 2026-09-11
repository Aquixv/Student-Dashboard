import { useState } from 'react';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { 
  GET_STUDENT_BY_MATRIC, 
  GET_AVAILABLE_COURSES, 
  GET_BILLS 
} from '../graphql/queries';
import { 
  ADD_COURSE, 
  ADD_BILL, 
  DELETE_BILL, 
  UPDATE_DEPARTMENT, 
  UPLOAD_RESULT 
} from '../graphql/mutations';
import type { GetBillsResponse, GetStudentByMatricResponse } from '../types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'COURSES' | 'BILLING' | 'STUDENTS' | 'RESULTS'>('COURSES');

  // --- 1. Search & Student State ---
  const [searchMatric, setSearchMatric] = useState('');
  const [fetchStudent, { data: searchData, loading: searchLoading, error: searchError }] = 
    useLazyQuery<GetStudentByMatricResponse>(GET_STUDENT_BY_MATRIC);

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
    onError: (err) => alert(`Failed to save: ${err.message}`),
    onCompleted: () => console.log('Department saved successfully!')
  });

  // --- 2. Billing State ---
  const { data: billsData } = useQuery<GetBillsResponse>(GET_BILLS);
  const [addBill] = useMutation(ADD_BILL, { refetchQueries: [{ query: GET_BILLS }] });
  const [deleteBill] = useMutation(DELETE_BILL, { refetchQueries: [{ query: GET_BILLS }] });
  const [billDesc, setBillDesc] = useState('');
  const [billAmount, setBillAmount] = useState('');

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    addBill({ variables: { description: billDesc, amount: Number(billAmount) } });
    setBillDesc('');
    setBillAmount('');
  };

  // --- 3. Course Management State ---
  const [courseData, setCourseData] = useState({
    code: '',
    title: '',
    units: 3,
    type: 'Compulsory'
  });

  const [addCourse, { loading: courseLoading, error: courseError }] = useMutation(ADD_COURSE, {
    refetchQueries: [{ query: GET_AVAILABLE_COURSES }],
    onCompleted: () => {
      setCourseData({ code: '', title: '', units: 3, type: 'Compulsory' });
      alert('Course successfully added to the catalog!');
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

  // --- 4. Result Upload Mutation ---
  const [uploadResult] = useMutation(UPLOAD_RESULT, {
    onCompleted: () => console.log('Grade auto-saved successfully.'),
    onError: (err) => alert(`Failed to save grade: ${err.message}`)
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      
      {/* --- SIDEBAR --- */}
      <aside style={{ 
        width: '260px', 
        backgroundColor: '#ffffff', 
        borderRight: '1px solid #e2e8f0', 
        padding: '2rem 1.25rem', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        flexShrink: 0 
      }}>
        <div>
          {/* Logo / Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
            <h2 style={{ color: '#095DC5', margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>EPortal</h2>
            <span style={{ 
              background: '#eff6ff', 
              color: '#095DC5', 
              fontSize: '0.7rem', 
              fontWeight: 700, 
              padding: '0.2rem 0.5rem', 
              borderRadius: '4px',
              border: '1px solid #bfdbfe' 
            }}>
              ADMIN
            </span>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              onClick={() => setActiveTab('COURSES')}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '0.85rem 1rem', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease',
                background: activeTab === 'COURSES' ? '#095DC5' : 'transparent',
                color: activeTab === 'COURSES' ? '#ffffff' : '#64748b'
              }}
            >
              <span><img style={{ height: '20px', width:'20px'}} src="https://www.svgrepo.com/show/400012/books.svg" alt="" /></span> Manage Courses
            </button>

            <button 
              onClick={() => setActiveTab('BILLING')}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '0.85rem 1rem', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease',
                background: activeTab === 'BILLING' ? '#095DC5' : 'transparent',
                color: activeTab === 'BILLING' ? '#ffffff' : '#64748b'
              }}
            >
              <span><img style={{ height: '20px', width:'20px'}} src="https://www.svgrepo.com/show/510942/credit-card-01.svg" alt="" /></span> Billing Config
            </button>

            <button 
              onClick={() => setActiveTab('STUDENTS')}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '0.85rem 1rem', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease',
                background: activeTab === 'STUDENTS' ? '#095DC5' : 'transparent',
                color: activeTab === 'STUDENTS' ? '#ffffff' : '#64748b'
              }}
            >
              <span><img style={{ height: '20px', width:'20px'}} src="https://www.svgrepo.com/show/483516/student-person-part-2.svg" alt="" /></span> Student Mapper
            </button>

            <button 
              onClick={() => setActiveTab('RESULTS')}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '0.85rem 1rem', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease',
                background: activeTab === 'RESULTS' ? '#095DC5' : 'transparent',
                color: activeTab === 'RESULTS' ? '#ffffff' : '#64748b'
              }}
            >
              <span><img style={{ height: '20px', width:'20px'}} src="https://www.svgrepo.com/show/373104/results.svg" alt="Download PDF" /></span> Upload Results
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Link */}
        <button 
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
          }}
        >
           Return to Student Portal
        </button>
      </aside>

      {/* --- MAIN WORKSPACE --- */}
      <main style={{ flex: 1, padding: '2.5rem 3.5rem', overflowY: 'auto' }}>
        
        {/* Top Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2 style={{ color: '#2b3674', fontSize: '1.8rem', fontWeight: 700, margin: '0 0 0.3rem 0' }}>
              {activeTab === 'COURSES' && 'Course Catalog Manager'}
              {activeTab === 'BILLING' && 'Semester Billing Configuration'}
              {activeTab === 'STUDENTS' && 'Student Department Mapper'}
              {activeTab === 'RESULTS' && 'Academic Result & Grading'}
            </h2>
            <p style={{ color: '#718096', fontSize: '0.95rem', margin: 0 }}>
              {activeTab === 'COURSES' && 'Add new accredited courses to the student registration catalog.'}
              {activeTab === 'BILLING' && 'Configure and publish mandatory semester fees.'}
              {activeTab === 'STUDENTS' && 'Look up students to assign or update their registered departments.'}
              {activeTab === 'RESULTS' && 'Search by matric number to grade registered courses.'}
            </p>
          </div>
          <span style={{ fontSize: '0.85rem', color: '#16a34a', background: '#dcfce7', padding: '0.4rem 0.8rem', borderRadius: '20px', fontWeight: 600 }}>
            ● Admin Session Active
          </span>
        </div>

        {/* Main Content Card */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '14px', 
          border: '1px solid #e2e8f0', 
          padding: '2.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
        }}>

          {/* TAB 1: MANAGE COURSES */}
          {activeTab === 'COURSES' && (
            <div>
              <h3 style={{ color: '#2b3674', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Add New Course</h3>
              {courseError && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>Error: {courseError.message}</p>}
              
              <form onSubmit={handleAddCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '600px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.4rem' }}>Course Code</label>
                    <input 
                      type="text" required placeholder="e.g. MTH 101"
                      value={courseData.code}
                      onChange={e => setCourseData({...courseData, code: e.target.value})}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.4rem' }}>Credit Units</label>
                    <input 
                      type="number" required min="1" max="6"
                      value={courseData.units}
                      onChange={e => setCourseData({...courseData, units: Number(e.target.value)})}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.4rem' }}>Course Title</label>
                  <input 
                    type="text" required placeholder="e.g. General Mathematics I"
                    value={courseData.title}
                    onChange={e => setCourseData({...courseData, title: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.4rem' }}>Course Type</label>
                  <select 
                    value={courseData.type}
                    onChange={e => setCourseData({...courseData, type: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white' }}
                  >
                    <option value="Compulsory">Compulsory</option>
                    <option value="Elective">Elective</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="primary-btn" 
                  disabled={courseLoading}
                  style={{ alignSelf: 'flex-start', padding: '0.75rem 2rem', marginTop: '0.5rem' }}
                >
                  {courseLoading ? 'Adding Course...' : 'Add Course to Catalog'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: BILLING CONFIG */}
          {activeTab === 'BILLING' && (
  <div>
    {/* Card Header with Balanced Action Button */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
      <div>
        <h3 style={{ margin: 0, color: '#2b3674', fontSize: '1.3rem', fontWeight: 700 }}>Fee Structure Management</h3>
        <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.875rem' }}>
          Configure mandatory levies and published session tuition rates.
        </p>
      </div>

      <button 
        type="button"
        onClick={() => alert('Semester fees published to all student portals!')}
        style={{
          backgroundColor: '#16a34a',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          padding: '0.65rem 1.25rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 4px rgba(22, 163, 74, 0.2)',
          transition: 'background-color 0.2s ease'
        }}
      >
        <span></span> Publish Fees
      </button>
    </div>

    {/* Proportional Form & Preview Grid */}
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '2rem', alignItems: 'start' }}>
      
      {/* Left Column: Form Card */}
      <form 
        onSubmit={handleAddBill} 
        style={{ 
          background: '#f8fafc', 
          padding: '1.5rem', 
          borderRadius: '10px', 
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
        }}
      >
        <h4 style={{ margin: '0 0 1.25rem 0', color: '#1e293b', fontSize: '1rem', fontWeight: 600 }}>
          Add Fee Item
        </h4>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
            Fee Description
          </label>
          <input 
            type="text" 
            required 
            placeholder="e.g. Health & Clinic Fee"
            value={billDesc} 
            onChange={e => setBillDesc(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#ffffff' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
            Amount (₦)
          </label>
          <input 
            type="number" 
            required 
            placeholder="15000"
            value={billAmount} 
            onChange={e => setBillAmount(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#ffffff' }}
          />
        </div>

        <button 
          type="submit" 
          className="primary-btn" 
          style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', borderRadius: '6px' }}
        >
          + Add to Invoice
        </button>
      </form>

      {/* Right Column: Live Invoice Preview */}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
        <div style={{ padding: '1.25rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1rem', fontWeight: 600 }}>Current Invoice Breakdown</h4>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
            {billsData?.getBills?.length || 0} Items Listed
          </span>
        </div>

        <div style={{ padding: '1rem 1.5rem' }}>
          {(!billsData?.getBills || billsData.getBills.length === 0) ? (
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '1.5rem 0', textAlign: 'center' }}>
              No fee components created yet. Use the form to configure session charges.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {billsData.getBills.map((bill: any) => (
                <div 
                  key={bill.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '0.85rem 1rem', 
                    background: '#ffffff', 
                    border: '1px solid #f1f5f9', 
                    borderRadius: '8px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                  }}
                >
                  <div>
                    <strong style={{ display: 'block', color: '#1e293b', fontSize: '0.95rem' }}>{bill.description}</strong>
                    <span style={{ color: '#095DC5', fontSize: '0.9rem', fontWeight: 600 }}>₦{bill.amount.toLocaleString()}</span>
                  </div>
                  
                  <button 
                    type="button"
                    onClick={() => deleteBill({ variables: { id: bill.id } })}
                    title="Remove fee"
                    style={{ 
                      background: '#fef2f2', 
                      border: '1px solid #fecaca', 
                      color: '#ef4444', 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '6px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Calculated Total Footer */}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.95rem' }}>Total Session Fee:</span>
                <span style={{ fontWeight: 800, color: '#095DC5', fontSize: '1.2rem' }}>
                  ₦{(billsData.getBills.reduce((acc: number, item: any) => acc + item.amount, 0)).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  </div>
)}
          {/* TAB 3: STUDENT MAPPER */}
          {activeTab === 'STUDENTS' && (
            <div>
              <h3 style={{ color: '#2b3674', marginBottom: '0.5rem', fontSize: '1.2rem' }}>Student Lookup</h3>
              <p style={{ color: '#718096', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Search by matriculation number to assign academic departments.</p>

              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '2rem', maxWidth: '500px' }}>
                <input 
                  type="text" 
                  placeholder="Enter Last 4 Digits (e.g. 1234)"
                  value={searchMatric}
                  onChange={(e) => setSearchMatric(e.target.value)}
                  style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', maxWidth: '700px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, color: '#2b3674', fontSize: '1.1rem' }}>{searchData.getStudentByMatric.fullName}</h4>
                    <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                      {searchData.getStudentByMatric.matricNumber} • <span style={{ color: '#16a34a' }}>Student Record Found</span>
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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

          {/* TAB 4: UPLOAD RESULTS */}
          {activeTab === 'RESULTS' && (
            <div>
              <h3 style={{ color: '#2b3674', marginBottom: '0.5rem', fontSize: '1.2rem' }}>Academic Grading</h3>
              <p style={{ color: '#718096', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Search for a student to view and grade their registered courses.</p>
              
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '2rem', maxWidth: '500px' }}>
                <input 
                  type="text" 
                  placeholder="Enter Last 4 Digits (e.g. 1234)"
                  value={searchMatric}
                  onChange={(e) => setSearchMatric(e.target.value)}
                  style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
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
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', maxWidth: '800px' }}>
                  {/* Bio Header */}
                  <div style={{ background: '#f8fafc', padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 0.3rem 0', color: '#2b3674', fontSize: '1.15rem' }}>
                      {searchData.getStudentByMatric.fullName}
                    </h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                      {searchData.getStudentByMatric.matricNumber} • {searchData.getStudentByMatric.department || 'No Department Assigned'}
                    </p>
                  </div>

                  {/* Course List */}
                  <div style={{ padding: '1.5rem' }}>
                    <h5 style={{ margin: '0 0 1rem 0', color: '#4a5568', fontSize: '0.95rem' }}>Registered Courses</h5>
                    
                    {searchData.getStudentByMatric.registeredCourses.length === 0 ? (
                      <p style={{ color: '#a0aec0', fontSize: '0.9rem' }}>This student has not registered for any courses.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {searchData.getStudentByMatric.registeredCourses.map((course: any) => (
                          <div key={course.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '8px' }}>
                            <div>
                              <strong style={{ display: 'block', color: '#2b3674', fontSize: '0.95rem' }}>{course.code}</strong>
                              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{course.title}</span>
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
                                    uploadResult({ 
                                      variables: { 
                                        matricNumber: searchData?.getStudentByMatric?.matricNumber, 
                                        courseCode: course.code, 
                                        score: Number(val) 
                                      } 
                                    });
                                  }
                                }}
                                style={{ width: '75px', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 'bold' }}
                              />
                            </div>
                          </div>
                        ))}
                        <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                          <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 500 }}>✓ Scores auto-save when clicking away</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}