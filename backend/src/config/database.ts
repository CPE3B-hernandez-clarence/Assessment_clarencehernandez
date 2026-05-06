import mongoose from 'mongoose';
import { env } from './env';

export const connectDatabase = async () => {
  if (!env.mongoUri) {
    console.error('MONGO_URI is required in your .env file');
    process.exit(1);
  }

  try {
    await mongoose.connect(env.mongoUri, { dbName: env.mongoDbName });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
  }
};
