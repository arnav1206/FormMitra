import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import formsRoutes from './routes/forms.js';
import aiRoutes from './routes/ai.js';
import applicationsRoutes from './routes/applications.js';
import adminRoutes from './routes/admin.js';
import { setMongoStatus } from './services/dbStore.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FormMitra API Backend',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/forms', formsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
  });
});

// Start Express listening immediately
app.listen(PORT, () => {
  console.log(`🚀 FormMitra Backend Server listening on http://localhost:${PORT}`);
  console.log(`🎙️ AI Voice & NLP Extraction Engine active on /api/ai/extract`);
});

// MongoDB Connection with seamless in-memory fallback
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/formmitra';

mongoose
  .connect(mongoUri, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    console.log('✅ MongoDB connected successfully at:', mongoUri);
    setMongoStatus(true);
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB connection not available (running in resilient in-memory mode):', err.message);
    setMongoStatus(false);
  });
