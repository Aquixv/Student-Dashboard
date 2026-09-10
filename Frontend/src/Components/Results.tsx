import { useQuery } from '@apollo/client/react';
import { GET_ME, GET_MY_RESULTS } from '../graphql/queries';
import { downloadTranscript } from '../utils/generateTranscripts';
import './SecondaryPages.css'; 
import type { GetMeResponse, GetMyResultsResponse } from '../types';

export default function Results() {
  const { data: userData, loading: userLoading } = useQuery<GetMeResponse>(GET_ME);
  const { data: resultsData, loading: resultsLoading } = useQuery<GetMyResultsResponse>(GET_MY_RESULTS);

  if (userLoading || resultsLoading) return <div style={{ padding: '2rem' }}>Loading academic records...</div>;

  const user = userData?.me || { fullName: 'Student', registeredCourses: [] };
  const realResults = resultsData?.getMyResults || [];

  // MVP GPA: Just a static placeholder until you want to write a full credit-weight algorithm
  const gpa = realResults.length > 0 ? "4.25" : "0.00";
  const enrichedResults = realResults.map((result: any) => {
    const courseMatch = user.registeredCourses?.find((c: any) => c.code === result.courseCode);
    return {
      ...result,
      code: result.courseCode, // <-- This ensures the PDF library finds it!
      title: courseMatch?.title || 'Unknown Course',
      units: courseMatch?.units || '-'
    };
  });
  const handleDownload = () => {
    // Pass the real data to your PDF utility
    downloadTranscript(user, enrichedResults, gpa);
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
                <th>Score</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {realResults.length > 0 ? (
                realResults.map((result: any) => (
                  <tr key={result.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{result.courseCode}</td>
                    <td style={{ color: '#4a5568' }}>{result.score}</td>
                    <td style={{ fontWeight: 'bold', color: '#2b3674' }}>{result.grade}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#a0aec0' }}>
                    No results have been uploaded for your matriculation number yet.
                  </td>
                </tr>
              )}
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
            disabled={realResults.length === 0}
          >
            Download Transcript
          </button>
        </div>
      </div>
    </div>
  );
}