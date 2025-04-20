import express, { Request, Response } from 'express';
import { validateDownload } from '../middleware/validateDownload';
import { startDownload, checkDownloadStatus } from '../controllers/downloadController';

const router = express.Router();

// Use middleware and route handlers with proper Promise<void> handling
router.post('/download', validateDownload, async (req: Request, res: Response) => {
  await startDownload(req, res);
});

router.get('/download/:id', async (req: Request, res: Response) => {
  await checkDownloadStatus(req, res);
});

export default router;
