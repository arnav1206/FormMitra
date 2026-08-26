import express from 'express';
import { getForms, getFormById, parseExternalForm } from '../controllers/formsController.js';

const router = express.Router();

router.get('/', getForms);
router.get('/:id', getFormById);
router.post('/parse-url', parseExternalForm);

export default router;
