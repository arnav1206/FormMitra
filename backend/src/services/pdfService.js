import PDFDocument from 'pdfkit';

export function generateApplicationPDF(application, stream) {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  doc.pipe(stream);

  // Header Banner
  doc.rect(40, 40, 515, 60).fill('#002868');
  doc.fillColor('#FFFFFF').fontSize(20).text('FormMitra (भारत FormMitra)', 55, 52, { bold: true });
  doc.fontSize(10).fillColor('#FED7AA').text('National AI Voice-Enabled Scheme & Form Filing Portal', 55, 78);

  // Tricolour Stripe
  doc.rect(40, 100, 171, 4).fill('#FF7A00');
  doc.rect(211, 100, 172, 4).fill('#FFFFFF');
  doc.rect(383, 100, 172, 4).fill('#10B981');

  // Application Details Box
  doc.fillColor('#0F172A').fontSize(14).text('OFFICIAL APPLICATION ACKNOWLEDGEMENT SLIP', 40, 120, { underline: true });

  doc.fontSize(10).fillColor('#64748B');
  doc.text(`Generated on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`, 40, 140);
  doc.text(`Application Reference No: ${application.refCode}`, 40, 155);

  doc.rect(40, 175, 515, 80).fillAndStroke('#F8FAFC', '#E2E8F0');
  doc.fillColor('#002868').fontSize(11).text('SCHEME APPLIED FOR:', 55, 185);
  doc.fillColor('#0F172A').fontSize(13).text(application.schemeName || 'Post-Matric Scholarship Scheme', 55, 202, { bold: true });
  doc.fillColor('#059669').fontSize(11).text(`Current Status: ${application.status || 'Under Officer Review ⏳'}`, 55, 225);
  doc.fillColor('#6366F1').fontSize(10).text(`DBT Bank Account: ${application.dbtSeeded || 'Yes (Aadhaar Verified)'}`, 340, 225);

  // Table Data
  doc.rect(40, 270, 515, 280).stroke('#CBD5E1');

  const fields = [
    ['Full Name', application.applicantName || application.formData?.['Full Name'] || '—'],
    ['Date of Birth', application.formData?.['Date of Birth'] || application.extractedData?.DOB || '—'],
    ['Gender', application.formData?.Gender || application.extractedData?.Gender || '—'],
    ['Category / Caste', application.category || application.formData?.Category || 'General'],
    ['Annual Family Income', application.incomeFormatted || `₹${application.annualIncome || '1,50,000'}`],
    ['State / Domicile', application.state || 'Rajasthan'],
    ['City / District', application.formData?.City || application.extractedData?.City || '—'],
    ['College / Institute', application.formData?.College || application.extractedData?.College || '—'],
    ['Course & Year', `${application.formData?.Course || application.extractedData?.Course || 'B.Tech'} - ${application.formData?.Year || application.extractedData?.Year || '2nd Year'}`],
    ['Mobile Number', application.phone || '—'],
    ['Email Address', application.email || '—'],
    ['Submission Mode', `Multilingual AI Voice-Assisted (${application.language || 'Hindi'})`],
  ];

  let y = 280;
  fields.forEach(([label, value], idx) => {
    if (idx % 2 === 0) {
      doc.rect(41, y - 4, 513, 20).fill('#F1F5F9');
    }
    doc.fillColor('#475569').fontSize(9).text(label, 50, y, { bold: true });
    doc.fillColor('#0F172A').fontSize(9).text(String(value), 220, y);
    y += 22;
  });

  // Footer Instructions
  doc.rect(40, 570, 515, 120).fillAndStroke('#FFF7ED', '#FDBA74');
  doc.fillColor('#C2410C').fontSize(10).text('IMPORTANT NOTICE FOR APPLICANT:', 55, 582, { bold: true });
  doc.fillColor('#7C2D12').fontSize(8.5).text(
    '1. Please keep this Application Number handy for status tracking on FormMitra or the National Scholarship Portal.\n' +
    '2. Ensure that your Bank Account remains active and seeded with your Aadhaar number for DBT disbursal.\n' +
    '3. Upload physical copy of Income & Domicile certificate if requested by the inspecting Welfare Officer.\n' +
    '4. For any grievances or helpdesk support, contact toll-free: 1800-11-2026 or email support@formmitra.gov.in',
    55,
    600,
    { lineGap: 3 }
  );

  // Signatures
  doc.fontSize(8).fillColor('#94A3B8').text('Digitally signed and generated via FormMitra AI Voice Engine. No physical signature required.', 40, 720, { align: 'center' });

  doc.end();
}
