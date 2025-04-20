import express, { Express } from 'express';
import downloadRoutes from './routes/downloadRoutes';

const app: Express = express();

app.use(express.json());
app.use('/api', downloadRoutes);

export default app;