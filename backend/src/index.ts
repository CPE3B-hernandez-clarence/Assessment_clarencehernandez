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
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';
const EMAIL_USER = 'yourgmail@gmail.com';
const EMAIL_PASS = 'your_google_app_password';
const SUPPORT_EMAIL = 'clarence.hernandez.7@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Connect to MongoDB
mongoose.connect(MONGO_URI, { dbName: 'Mail' })
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

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
    });

    await transporter.sendMail({
      from: `"Contact Support" <${EMAIL_USER}>`,
      to: SUPPORT_EMAIL,
      subject: 'New Contact Support Message',
      html: `
        <h3>New Contact Support Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res.status(201).json({
      message: 'Contact support message saved and email sent successfully',
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
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
