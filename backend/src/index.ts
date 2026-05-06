import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import nodemailer from 'nodemailer';
import ContactSupport from './models/ContactSupport';

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = Number(process.env.EMAIL_PORT || 587);
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || EMAIL_USER;

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Connect to MongoDB
if (!MONGO_URI) {
  console.error('MONGO_URI is required in your .env file');
  process.exit(1);
}

mongoose.connect(MONGO_URI, { dbName: process.env.MONGO_DB_NAME || 'Mail' })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.post('/contact-support', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({
        message: 'Name, email, and message are required',
      });
      return;
    }

    const contactSupport = await ContactSupport.create({
      name,
      email,
      message,
      submittedAt: new Date(),
    });

    if (EMAIL_USER && EMAIL_PASS && SUPPORT_EMAIL) {
      try {
        await transporter.sendMail({
          from: `"Contact Support" <${EMAIL_USER}>`,
          replyTo: email,
          to: SUPPORT_EMAIL,
          subject: 'New Contact Support Message',
          text: [
            'New Contact Support Message',
            `Name: ${name}`,
            `Email: ${email}`,
            `Submitted At: ${contactSupport.submittedAt.toISOString()}`,
            '',
            message,
          ].join('\n'),
        });
      } catch (emailError) {
        console.error('Contact support email error:', emailError);
      }
    }

    res.status(201).json({
      message: 'Contact support message saved successfully',
      data: contactSupport,
    });
  } catch (error) {
    console.error('Contact support error:', error);

    res.status(500).json({
      message: 'Something went wrong while sending the contact support message',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
