// Resilient In-Memory + MongoDB Hybrid Storage Store
// Ensures the entire app works seamlessly out-of-the-box whether MongoDB is connected or running offline.

import { User } from '../models/User.js';
import { Application } from '../models/Application.js';
import bcrypt from 'bcryptjs';

let isMongoConnected = false;

export function setMongoStatus(connected) {
  isMongoConnected = connected;
}

export function getMongoStatus() {
  return isMongoConnected;
}

// In-Memory Fallback Seed Data
const mockUsers = [
  {
    _id: 'mock_user_1',
    name: 'Rahul Sharma',
    phone: '9876543210',
    email: 'rahul.sharma@example.com',
    password: '$2a$10$wN31Xn7kOaQk5n3y0V2g..Hq47f4P/qF4jJ3kK2lM.p2V3b.56nNu', // "password123"
    state: 'Rajasthan',
    category: 'OBC',
    role: 'student',
    createdAt: new Date(),
  },
];

const mockApplications = [
  {
    _id: 'mock_app_1',
    refCode: 'FMT-2026-89412',
    applicantName: 'Rahul Sharma',
    schemeId: 'post_matric',
    schemeName: 'Post-Matric Scholarship Scheme',
    state: 'Rajasthan',
    category: 'OBC',
    annualIncome: 150000,
    incomeFormatted: '₹1,50,000',
    phone: '9876543210',
    email: 'rahul.sharma@example.com',
    formData: {
      'Full Name': 'Rahul Sharma',
      'Date of Birth': '15/08/2003',
      'Gender': 'Male',
      'Category': 'OBC',
      'Address': 'Sector 4, Mansarovar',
      'City': 'Jaipur',
      'State': 'Rajasthan',
      'PIN Code': '302020',
      'College': 'BIT Institute',
      'Course': 'B.Tech',
      'Year': 'Second Year',
      'Percentage / CGPA': '8.6 CGPA',
      'Annual Family Income': '150000',
      'Phone Number': '9876543210',
      'Email': 'rahul.sharma@example.com',
    },
    extractedData: {
      Name: 'Rahul Sharma',
      City: 'Jaipur',
      State: 'Rajasthan',
      Course: 'B.Tech',
      Year: 'Second Year',
      Income: '150000',
      Phone: '9876543210',
      Category: 'OBC',
      Gender: 'Male',
    },
    status: 'Under Officer Review ⏳',
    dbtSeeded: 'Yes (Aadhaar Verified)',
    submittedAt: new Date(Date.now() - 3600000 * 2),
    language: 'Hindi',
  },
  {
    _id: 'mock_app_2',
    refCode: 'FMT-2026-74129',
    applicantName: 'Priya Mohanty',
    schemeId: 'state_merit',
    schemeName: 'State Higher Education Merit Scholarship',
    state: 'Odisha',
    category: 'General',
    annualIncome: 120000,
    incomeFormatted: '₹1,20,000',
    phone: '9876543211',
    email: 'priya.mohanty@example.com',
    formData: {
      'Full Name': 'Priya Mohanty',
      'City': 'Bhubaneswar',
      'State': 'Odisha',
      'Course': 'B.Sc',
      'Year': 'First Year',
    },
    status: 'Approved for Disbursal ✅',
    dbtSeeded: 'Yes (Aadhaar Verified)',
    submittedAt: new Date(Date.now() - 3600000 * 24),
    language: 'Odia',
  },
  {
    _id: 'mock_app_3',
    refCode: 'FMT-2026-63201',
    applicantName: 'Suresh Kumar',
    schemeId: 'central_sector',
    schemeName: 'Central Sector Scheme of Scholarships',
    state: 'Tamil Nadu',
    category: 'SC',
    annualIncome: 210000,
    incomeFormatted: '₹2,10,000',
    phone: '9876543212',
    email: 'suresh.k@example.com',
    formData: {
      'Full Name': 'Suresh Kumar',
      'City': 'Chennai',
      'State': 'Tamil Nadu',
      'Course': 'B.Com',
      'Year': 'Third Year',
    },
    status: 'Income Certificate Pending ⚠️',
    dbtSeeded: 'No (Action Required)',
    submittedAt: new Date(Date.now() - 3600000 * 48),
    language: 'Tamil',
  },
];

export const DB = {
  async findUserByIdentifier(identifier) {
    const clean = identifier.trim().toLowerCase();
    if (isMongoConnected) {
      return User.findOne({ $or: [{ phone: clean }, { email: clean }] });
    }
    return mockUsers.find((u) => u.phone === clean || u.email.toLowerCase() === clean);
  },

  async findUserById(id) {
    if (isMongoConnected) {
      return User.findById(id);
    }
    return mockUsers.find((u) => u._id === id);
  },

  async createUser(userData) {
    if (isMongoConnected) {
      const user = new User(userData);
      return user.save();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const newUser = {
      _id: `user_${Date.now()}`,
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
    };
    mockUsers.push(newUser);
    return newUser;
  },

  async createApplication(appData) {
    if (isMongoConnected) {
      const app = new Application(appData);
      return app.save();
    }
    const newApp = {
      _id: `app_${Date.now()}`,
      ...appData,
      submittedAt: new Date(),
    };
    mockApplications.unshift(newApp);
    return newApp;
  },

  async findApplicationByRef(refCode) {
    const cleanRef = refCode.trim().toUpperCase();
    if (isMongoConnected) {
      return Application.findOne({ refCode: { $regex: new RegExp(`^${cleanRef}$`, 'i') } });
    }
    return mockApplications.find((a) => a.refCode.toUpperCase() === cleanRef);
  },

  async getAllApplications(filter = {}) {
    if (isMongoConnected) {
      return Application.find(filter).sort({ submittedAt: -1 });
    }
    return [...mockApplications];
  },

  async updateApplicationStatus(refCode, newStatus) {
    const cleanRef = refCode.trim().toUpperCase();
    if (isMongoConnected) {
      return Application.findOneAndUpdate(
        { refCode: { $regex: new RegExp(`^${cleanRef}$`, 'i') } },
        { status: newStatus, updatedAt: new Date() },
        { new: true }
      );
    }
    const app = mockApplications.find((a) => a.refCode.toUpperCase() === cleanRef);
    if (app) {
      app.status = newStatus;
      app.updatedAt = new Date();
      return app;
    }
    return null;
  },
};
