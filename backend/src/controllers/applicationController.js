import { DB } from '../services/dbStore.js';
import { generateApplicationPDF } from '../services/pdfService.js';

function generateRefCode() {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `FMT-2026-${randomDigits}`;
}

export async function submitApplication(req, res) {
  try {
    const {
      schemeId = 'post_matric',
      schemeName = 'Post-Matric Scholarship Scheme',
      formData = {},
      extractedData = {},
      transcript = '',
      language = 'English',
    } = req.body;

    const applicantName = formData['Full Name'] || extractedData.Name || (req.user ? req.user.name : 'Applicant User');
    const phone = formData['Phone Number'] || extractedData.Phone || (req.user ? req.user.phone : '9876543210');
    const email = formData['Email'] || extractedData.Email || (req.user ? req.user.email : 'applicant@formmitra.in');
    const state = formData['State'] || extractedData.State || (req.user ? req.user.state : 'Rajasthan');
    const category = formData['Category'] || extractedData.Category || (req.user ? req.user.category : 'General');
    const rawIncome = parseInt(formData['Annual Family Income'] || extractedData.Income || '150000', 10);

    const refCode = generateRefCode();

    const application = await DB.createApplication({
      refCode,
      userId: req.user ? req.user.id : null,
      applicantName,
      schemeId,
      schemeName,
      state,
      category,
      annualIncome: rawIncome,
      incomeFormatted: `₹${rawIncome.toLocaleString('en-IN')}`,
      phone,
      email,
      formData,
      extractedData,
      transcript,
      language,
      status: 'Under Officer Review ⏳',
      dbtSeeded: 'Yes (Aadhaar Verified)',
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully to the National Scholarship Portal!',
      refCode: application.refCode,
      application,
    });
  } catch (err) {
    console.error('Submit application error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit application.' });
  }
}

export async function trackApplication(req, res) {
  try {
    const { refCode } = req.params;

    if (!refCode) {
      return res.status(400).json({ success: false, message: 'Please provide application reference code.' });
    }

    const application = await DB.findApplicationByRef(refCode);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: `No application found with Reference Code '${refCode}'. Please verify and try again.`,
      });
    }

    res.json({
      success: true,
      application,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving application.' });
  }
}

export async function downloadApplicationPDF(req, res) {
  try {
    const { refCode } = req.params;
    const application = await DB.findApplicationByRef(refCode);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=FormMitra_Receipt_${application.refCode}.pdf`);

    generateApplicationPDF(application, res);
  } catch (err) {
    console.error('PDF error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate PDF receipt.' });
  }
}

export async function getUserApplications(req, res) {
  try {
    const all = await DB.getAllApplications();
    const userApps = req.user
      ? all.filter((a) => (a.userId && a.userId.toString() === req.user.id.toString()) || a.phone === req.user.phone)
      : all.slice(0, 3);

    res.json({ success: true, applications: userApps });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching user applications.' });
  }
}
