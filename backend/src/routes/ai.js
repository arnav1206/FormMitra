import express from 'express';
import multer from 'multer';
import os from 'os';
import { extractFields, getSampleTranscript, transcribeAudio } from '../controllers/aiController.js';

const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
});

const router = express.Router();

router.post('/extract', extractFields);
router.get('/sample-transcript', getSampleTranscript);
router.post('/transcribe', upload.single('audio'), transcribeAudio);
router.post('/wispr-flow', upload.single('audio'), transcribeAudio);

export default router;
