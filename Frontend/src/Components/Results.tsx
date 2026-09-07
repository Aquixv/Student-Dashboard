import { useQuery } from '@apollo/client/react';
import { GET_ME } from '../graphql/queries';
import { downloadTranscript } from '../utils/generateTranscripts';

import './Results.css';
import type { GetMeResponse } from '../types';

export default function Results() {
  const { data, loading } = useQuery<GetMeResponse>(GET_ME);

  if (loading) return <div>Loading results...</div>;

  const user = data?.me || { fullName: 'Student' };

  // Hardcoded data matching your UI until the admin backend is built
  const gpa = "4.25";
  const mockResults = [
    { id: 1, code: 'CSC 101', title: 'Intro to Computer Science', units: 3, score: 78, grade: 'A' },
    { id: 2, code: 'MTH 101', title: 'Elementary Mathematics I', units: 3, score: 65, grade: 'B' },
    { id: 3, code: 'PHY 101', title: 'General Physics I', units: 3, score: 55, grade: 'C' },
    { id: 4, code: 'GST 101', title: 'Use of English', units: 2, score: 72, grade: 'A' },
  ];

  const handleDownload = () => {
    downloadTranscript(user, mockResults, gpa);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h2>Academic Results</h2>
        <p>100 Level - Harmattan Semester 2025/2026</p>
      </div>

      <div className="content-card">
        <div className="results-table-container">
          <table className="results-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#718096' }}>
                <th style={{ padding: '1rem' }}>Course Code</th>
                <th>Course Title</th>
                <th>Units</th>
                <th>Score</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {mockResults.map((result) => (
                <tr key={result.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{result.code}</td>
                  <td style={{ color: '#4a5568' }}>{result.title}</td>
                  <td style={{ color: '#4a5568' }}>{result.units}</td>
                  <td style={{ color: '#4a5568' }}>{result.score}</td>
                  <td style={{ fontWeight: 'bold', color: '#2b3674' }}>{result.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="results-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderTop: '1px dashed #e2e8f0' }}>
          <div style={{ fontSize: '1.1rem' }}>
            <span style={{ color: '#718096' }}>Semester GPA: </span>
            <strong style={{ color: '#2b3674' }}>{gpa}</strong>
          </div>
          <button 
            className="primary-btn-sm" 
            onClick={handleDownload}
          >
            Download Transcript
          </button>
        </div>
      </div>
    </div>
  );
}