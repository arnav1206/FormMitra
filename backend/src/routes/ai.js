import express from 'express';
import { extractFields, getSampleTranscript, transcribeAudio } from '../controllers/aiController.js';

const router = express.Router();

router.post('/extract', extractFields);
router.get('/sample-transcript', getSampleTranscript);
router.post('/transcribe', transcribeAudio);

export default router;
