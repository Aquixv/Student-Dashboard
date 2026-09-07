import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const downloadReceipt = (user: any, invoiceDetails: any) => {
  const doc = new jsPDF();
  
  // 1. Header Section
  doc.setFontSize(22);
  doc.setTextColor(43, 54, 116); // Your brand color (#2b3674)
  doc.text('EduPortal', 14, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Official Payment Receipt', 14, 30);
  
  // 2. Student Information (Left)
  doc.setFontSize(10);
  doc.text(`Student Name: ${user.fullName}`, 14, 45);
  doc.text(`Matric No: ${user.matricNumber || 'Pending Assignment'}`, 14, 52);
  doc.text(`Department: ${user.department || 'Not Assigned'}`, 14, 59);
  doc.text(`Level: ${user.level || '100 Level'}`, 14, 66);
  
  // 3. Invoice Information (Right)
  doc.text(`Invoice Ref: ${invoiceDetails.reference}`, 130, 45);
  doc.text(`Date: ${invoiceDetails.date}`, 130, 52);
  doc.text(`Status: PAID`, 130, 59);
  doc.text(`Session: 2026/2027 Harmattan`, 130, 66);

  // 4. Fee Breakdown Table
  autoTable(doc, {
    startY: 75,
    head: [['Fee Description', 'Amount (NGN)']],
    body: invoiceDetails.items.map((item: any) => [item.desc, item.amount]),
    foot: [['Total Paid', `NGN ${invoiceDetails.total}`]],
    theme: 'striped',
    headStyles: { fillColor: [9, 93, 197] }, // Primary button color (#095DC5)
    footStyles: { fillColor: [241, 245, 249], textColor: [0, 0, 0] },
  });
  
  // 5. Footer & Watermark
  // @ts-ignore - jspdf-autotable attaches lastAutoTable dynamically
  const finalY = doc.lastAutoTable.finalY + 20; 
  
  doc.setFontSize(9);
  doc.setTextColor(113, 128, 150);
  doc.text('This is a computer-generated document. No physical signature is required.', 14, finalY);
  doc.text('Secured by EduPortal Financial Services', 14, finalY + 7);
  
  // 6. Trigger the download
  doc.save(`Receipt_${invoiceDetails.reference}.pdf`);
};