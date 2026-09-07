import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const downloadTranscript = (user: any, results: any[], gpa: string) => {
  const doc = new jsPDF();
  
  // 1. Header Section
  doc.setFontSize(22);
  doc.setTextColor(43, 54, 116); // Brand Color
  doc.text('EduPortal', 14, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Official Academic Transcript', 14, 30);
  
  // 2. Student Information (Left)
  doc.setFontSize(10);
  doc.text(`Student Name: ${user.fullName}`, 14, 45);
  doc.text(`Matric No: ${user.matricNumber || 'Pending Assignment'}`, 14, 52);
  doc.text(`Department: ${user.department || 'Not Assigned'}`, 14, 59);
  doc.text(`Level: ${user.level || '100 Level'}`, 14, 66);
  
  // 3. Academic Session Information (Right)
  doc.text(`Session: 2025/2026`, 130, 45);
  doc.text(`Semester: Harmattan`, 130, 52);
  doc.text(`Cumulative GPA: ${gpa}`, 130, 59);

  // 4. Map the results data into an array of arrays for the table
  const tableBody = results.map(result => [
    result.code, 
    result.title, 
    result.units, 
    result.score, 
    result.grade
  ]);

  // 5. Build the Table
  autoTable(doc, {
    startY: 75,
    head: [['Course Code', 'Course Title', 'Units', 'Score', 'Grade']],
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [43, 54, 116] }, 
    styles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });
  
  // 6. Footer
  // @ts-ignore
  const finalY = doc.lastAutoTable.finalY + 20; 
  
  doc.setFontSize(9);
  doc.setTextColor(113, 128, 150);
  doc.text('This transcript is system-generated and valid without a physical signature.', 14, finalY);
  
  doc.save(`${user.matricNumber || 'Student'}_Transcript.pdf`);
};