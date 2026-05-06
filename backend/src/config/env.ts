import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || '',
  mongoDbName: process.env.MONGO_DB_NAME || 'Mail',
  emailHost: process.env.EMAIL_HOST || 'smtp.gmail.com',
  emailPort: toNumber(process.env.EMAIL_PORT, 587),
  emailUser: process.env.EMAIL_USER || '',
  emailPass: process.env.EMAIL_PASS || '',
  supportEmail: process.env.SUPPORT_EMAIL || process.env.EMAIL_USER || '',
};
