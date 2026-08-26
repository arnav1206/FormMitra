import express from 'express';
import {
  submitApplication,
  trackApplication,
  downloadApplicationPDF,
  getUserApplications,
} from '../controllers/applicationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, submitApplication);
router.get('/user', authenticateToken, getUserApplications);
router.get('/track/:refCode', trackApplication);
router.get('/pdf/:refCode', downloadApplicationPDF);

export default router;
