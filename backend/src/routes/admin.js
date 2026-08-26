import express from 'express';
import { getAdminApplications, updateStatus, getAdminStats } from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/applications', authenticateToken, requireAdmin, getAdminApplications);
router.patch('/applications/:refCode/status', authenticateToken, requireAdmin, updateStatus);
router.get('/stats', authenticateToken, requireAdmin, getAdminStats);

export default router;
