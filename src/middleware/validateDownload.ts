import { Request, Response, NextFunction } from 'express';

export const validateDownload = (req: Request, res: Response, next: NextFunction): void => {
  // Get the URL from the request body
  const { url } = req.body;

  // Check if URL is provided
  if (!url) {
    res.status(400).json({ error: 'URL is required' });
    return;
  }

  // Check if URL is valid
  try {
    new URL(url);
    // URL is valid, proceed to the next middleware or route handler
    next();
  } catch (error) {
    // URL is invalid
    res.status(400).json({ error: 'Invalid URL format' });
  }
};
