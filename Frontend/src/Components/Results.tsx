import './Results.css';

export default function Results() {
  const mockResults = [
    { code: 'CSC 101', title: 'Intro to Computer Science', units: 3, score: 78, grade: 'A' },
    { code: 'MTH 101', title: 'Elementary Mathematics I', units: 3, score: 65, grade: 'B' },
    { code: 'PHY 101', title: 'General Physics I', units: 3, score: 55, grade: 'C' },
    { code: 'GST 101', title: 'Use of English', units: 2, score: 72, grade: 'A' },
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h2>Academic Results</h2>
        <p>100 Level - Harmattan Semester 2025/2026</p>
      </div>
      
      <div className="content-card">
        <table className="results-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Units</th>
              <th>Score</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {mockResults.map((res) => (
              <tr key={res.code}>
                <td className="font-bold text-blue">{res.code}</td>
                <td>{res.title}</td>
                <td>{res.units}</td>
                <td>{res.score}</td>
                <td className={`grade-${res.grade}`}>{res.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="results-summary">
          <span>Semester GPA: <strong>4.25</strong></span>
          <button className="primary-btn-sm">Download Transcript</button>
        </div>
      </div>
    </div>
  );
}