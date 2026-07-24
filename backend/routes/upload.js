import express from 'express';
import multer from 'multer';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth);

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Uploads a file and returns extracted text so it can be attached as context to a message
router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const { path: filePath, originalname, mimetype } = req.file;
  let text = '';

  try {
    if (mimetype === 'application/pdf') {
      const buffer = fs.readFileSync(filePath);
      const parsed = await pdfParse(buffer);
      text = parsed.text;
    } else if (mimetype.startsWith('text/') || originalname.match(/\.(txt|md|csv|json|js|py|ts)$/)) {
      text = fs.readFileSync(filePath, 'utf-8');
    } else {
      text = '[Binary file - content not extracted]';
    }
  } catch (err) {
    text = `[Could not extract text: ${err.message}]`;
  } finally {
    fs.unlinkSync(filePath); // clean up temp file
  }

  // Cap extracted text to keep context window reasonable
  const truncated = text.slice(0, 8000);
  res.json({ filename: originalname, text: truncated });
});

export default router;
