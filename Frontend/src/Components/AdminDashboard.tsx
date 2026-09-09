import { useState } from 'react';
import './Results.css'; 

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'COURSES' | 'RESULTS'>('COURSES');

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h2>Admin Control Panel</h2>
        <p>Manage portal records, academic results, and course catalogs.</p>
      </div>

      <div className="content-card" style={{ marginBottom: '2rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className={`secondary-btn ${activeTab === 'COURSES' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('COURSES')}
            style={{ flex: 1, border: activeTab === 'COURSES' ? '2px solid #095DC5' : '1px solid #e2e8f0' }}
          >
            Manage Courses
          </button>
          <button 
            className={`secondary-btn ${activeTab === 'RESULTS' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('RESULTS')}
            style={{ flex: 1, border: activeTab === 'RESULTS' ? '2px solid #095DC5' : '1px solid #e2e8f0' }}
          >
            Upload Results
          </button>
        </div>
      </div>

      <div className="content-card" style={{ padding: '2rem' }}>
        {activeTab === 'COURSES' && (
          <div>
            <h3 style={{ color: '#2b3674', marginBottom: '0.5rem' }}>Add New Course</h3>
            <p style={{ color: '#718096', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Push a new course to the registration catalog.</p>
          </div>
        )}

        {activeTab === 'RESULTS' && (
          <div>
            <h3 style={{ color: '#2b3674', marginBottom: '0.5rem' }}>Upload Academic Result</h3>
            <p style={{ color: '#718096', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Bind a final grade to a student's matriculation number.</p>
          </div>
        )}
      </div>
    </div>
  );
}