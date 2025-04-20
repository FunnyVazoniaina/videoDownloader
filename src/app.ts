import dotenv from 'dotenv';
// Load environment variables before any other imports
dotenv.config();

import express, { Express } from 'express';
import cors from 'cors';
import downloadRoutes from './routes/downloadRoutes';

const app: Express = express();

// Enable CORS for requests from the frontend
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from the frontend
  methods: ['GET', 'POST'], // Allow specific methods
  allowedHeaders: ['Content-Type'], // Allow specific headers
}));

app.use(express.json());
app.use('/api', downloadRoutes);

export default app;
