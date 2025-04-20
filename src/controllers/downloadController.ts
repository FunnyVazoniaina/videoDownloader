import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { createDownload, getDownload } from '../services/downloadService';

export const validateDownload = [
  body('url').isURL().withMessage('Invalid URL'),
];

export const startDownload = async (req: Request, res: Response) => {
  console.log('Received POST /api/download with body:', req.body); // Add this log
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array()); // Add this log
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { url } = req.body;
    console.log('Calling createDownload with url:', url); // Add this log
    const download = await createDownload(url);
    console.log('Download created:', download); // Add this log
    res.status(201).json(download);
  } catch (error) {
    console.error('Error in startDownload:', error); // Add this log
    res.status(500).json({ error: 'Failed to start download' });
  }
};

export const checkDownloadStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const download = await getDownload(parseInt(id));
    if (!download) {
      return res.status(404).json({ error: 'Download not found' });
    }
    res.json(download);
  } catch (error) {
    console.error('Error in checkDownloadStatus:', error); // Add this log
    res.status(500).json({ error: 'Failed to check status' });
  }
};