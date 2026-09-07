import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const downloadProfileForm = (user: any) => {
  const doc = new jsPDF();
  
  // 1. Header Section
  doc.setFontSize(22);
  doc.setTextColor(43, 54, 116);
  doc.text('EduPortal', 14, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Student Bio-Data & Course Registration Form', 14, 30);
  
  // 2. Student Information (Left)
  doc.setFontSize(10);
  doc.text(`Full Name: ${user.fullName}`, 14, 45);
  doc.text(`Matriculation No: ${user.matricNumber || 'Pending Assignment'}`, 14, 52);
  doc.text(`Email Address: ${user.email}`, 14, 59);
  
  // 3. Academic Information (Right)
  doc.text(`Department: ${user.department || 'Not Assigned'}`, 130, 45);
  doc.text(`Current Level: ${user.level || '100 Level'}`, 130, 52);
  doc.text(`Financial Status: ${user.hasPaidFees ? 'Cleared' : 'Outstanding Balance'}`, 130, 59);

  // 4. Map the registered courses
  const courses = user.registeredCourses || [];
  const tableBody = courses.map((course: any) => [
    course.code, 
    course.title, 
    course.units
  ]);
  
  const totalUnits = courses.reduce((sum: number, course: any) => sum + course.units, 0);

  // 5. Build the Courses Table
  autoTable(doc, {
    startY: 70,
    head: [['Course Code', 'Course Title', 'Units']],
    body: tableBody,
    foot: [['', 'Total Registered Units:', totalUnits.toString()]],
    theme: 'grid',
    headStyles: { fillColor: [43, 54, 116] },
    footStyles: { fillColor: [241, 245, 249], textColor: [0, 0, 0], fontStyle: 'bold' },
    styles: { fontSize: 10 },
  });
  
  // 6. Footer & Signatures
  // @ts-ignore
  const finalY = doc.lastAutoTable.finalY + 30; 
  
  doc.setLineWidth(0.5);
  doc.line(14, finalY, 74, finalY); // Student signature line
  doc.line(130, finalY, 190, finalY); // Advisor signature line
  
  doc.setFontSize(9);
  doc.text('Student Signature & Date', 14, finalY + 5);
  doc.text('Academic Advisor Signature & Date', 130, finalY + 5);
  
  doc.save(`${user.matricNumber || 'Student'}_CourseForm.pdf`);
};