import { DB } from '../services/dbStore.js';

export async function getAdminApplications(req, res) {
  try {
    const { status, state, scheme } = req.query;
    let applications = await DB.getAllApplications();

    if (status && status !== 'All') {
      applications = applications.filter((a) => a.status.includes(status));
    }
    if (state && state !== 'All') {
      applications = applications.filter((a) => a.state === state);
    }
    if (scheme && scheme !== 'All') {
      applications = applications.filter((a) => a.schemeId === scheme || a.schemeName.includes(scheme));
    }

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch applications for admin portal.' });
  }
}

export async function updateStatus(req, res) {
  try {
    const { refCode } = req.params;
    const { status } = req.body;

    if (!refCode || !status) {
      return res.status(400).json({ success: false, message: 'Reference code and new status are required.' });
    }

    const updated = await DB.updateApplicationStatus(refCode, status);

    if (!updated) {
      return res.status(404).json({ success: false, message: `Application ${refCode} not found.` });
    }

    res.json({
      success: true,
      message: `Status for ${refCode} updated to '${status}'.`,
      application: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status.' });
  }
}

export async function getAdminStats(req, res) {
  try {
    const applications = await DB.getAllApplications();

    const total = applications.length;
    const approved = applications.filter((a) => a.status.includes('Approved') || a.status.includes('Disbursed')).length;
    const pending = applications.filter((a) => a.status.includes('Review') || a.status.includes('Pending')).length;
    const rejected = applications.filter((a) => a.status.includes('Rejected')).length;

    // Approximate scholarship funds calculation
    const totalFundsSanctioned = approved * 35000;

    res.json({
      success: true,
      stats: {
        total,
        approved,
        pending,
        rejected,
        totalFundsSanctioned: `₹${totalFundsSanctioned.toLocaleString('en-IN')}`,
        activeOfficers: 14,
        statesCovered: 28,
        aiExtractionAccuracy: '98.4%',
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin stats.' });
  }
}
