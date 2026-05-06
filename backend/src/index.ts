import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import supportRoutes from './routes/supportRoutes';

const app = express();
app.use(cors({
  origin: env.clientUrl,
}));
app.use(express.json());

void connectDatabase();

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.use(supportRoutes);

app.listen(env.port, () => {
  console.log(`Server is running on http://localhost:${env.port}`);
});
