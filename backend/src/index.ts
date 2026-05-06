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

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const buildSupportEmailHtml = ({
  name,
  email,
  message,
  submittedAt,
}: {
  name: string;
  email: string;
  message: string;
  submittedAt: Date;
}) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');
  const submittedDate = submittedAt.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Support request</title>
  </head>
  <body style="margin:0; padding:0; background:#ffffff; color:#5c7180; font-family:Inter, 'Segoe UI', Roboto, Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff; padding:28px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px; overflow:hidden; background:#eafafa; border:1px solid #bddfe0; border-radius:8px; box-shadow:0 20px 38px rgba(8,129,151,0.18), -10px 10px 22px rgba(8,161,120,0.10);">
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 12px; color:#088b83; font-size:12px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;">
                  Live preview
                </p>
                <h1 style="margin:0 0 18px; color:#0c2f38; font-size:28px; line-height:1.18; font-weight:750;">
                  Support request
                </h1>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff; border:1px solid #bddfe0; border-radius:8px; box-shadow:0 20px 38px rgba(8,129,151,0.18), -10px 10px 22px rgba(8,161,120,0.10);">
                  <tr>
                    <td style="padding:22px;">
                      <p style="margin:0 0 6px; color:#5e8790; font-size:12px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase;">
                        From
                      </p>
                      <p style="margin:0 0 4px; color:#0c2f38; font-size:20px; line-height:1.2; font-weight:700;">
                        ${safeName}
                      </p>
                      <p style="margin:0;">
                        <a href="mailto:${safeEmail}" style="color:#088b83; text-decoration:none; word-break:break-word;">
                          ${safeEmail}
                        </a>
                      </p>

                      <div style="height:22px; line-height:22px;">&nbsp;</div>

                      <p style="margin:0 0 6px; color:#5e8790; font-size:12px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase;">
                        Message
                      </p>
                      <p style="margin:0; color:#0c2f38; font-size:15px; line-height:1.5; word-break:break-word;">
                        ${safeMessage}
                      </p>

                      <div style="height:22px; line-height:22px;">&nbsp;</div>

                      <p style="margin:0; color:#5e8790; font-size:12px;">
                        Submitted ${escapeHtml(submittedDate)}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

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

    const submittedAt = new Date();
    const emailHtml = buildSupportEmailHtml({
      name,
      email,
      message,
      submittedAt,
    });

    const contactSupport = await ContactSupport.create({
      name,
      email,
      message,
      submittedAt,
      emailHtml,
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
          html: contactSupport.emailHtml,
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
