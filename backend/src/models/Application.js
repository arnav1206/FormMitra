import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  refCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  applicantName: {
    type: String,
    required: true,
  },
  schemeId: {
    type: String,
    required: true,
  },
  schemeName: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    default: 'Rajasthan',
  },
  category: {
    type: String,
    default: 'General',
  },
  annualIncome: {
    type: Number,
    default: 0,
  },
  incomeFormatted: {
    type: String,
    default: '₹0',
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  formData: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  extractedData: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  transcript: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: 'English',
  },
  status: {
    type: String,
    enum: [
      'Under Officer Review ⏳',
      'Approved for Disbursal ✅',
      'Income Certificate Pending ⚠️',
      'Rejected ❌',
      'Disbursed to Bank 🏛️',
    ],
    default: 'Under Officer Review ⏳',
  },
  dbtSeeded: {
    type: String,
    default: 'Yes (Aadhaar Verified)',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Application = mongoose.model('Application', applicationSchema);
