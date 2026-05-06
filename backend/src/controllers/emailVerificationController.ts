import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import { env } from '../config/env';
import { transporter } from '../config/mailer';
import EmailVerification from '../models/EmailVerification';

const OTP_RESEND_DELAY_MS = 15_000;
const OTP_EXPIRATION_MS = 5 * 60 * 1000;

export const requestEmailVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email?: string };

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const existingRecord = await EmailVerification.findOne({ email });
    if (existingRecord?.lastRequestedAt) {
      const timeDiff = Date.now() - existingRecord.lastRequestedAt.getTime();
      if (timeDiff < OTP_RESEND_DELAY_MS) {
        res.status(429).json({ message: 'Please wait 15 seconds before requesting another OTP.' });
        return;
      }
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    await EmailVerification.findOneAndUpdate(
      { email },
      { email, otp, isVerified: false, lastRequestedAt: Date.now(), createdAt: Date.now() },
      { upsert: true, new: true },
    );

    await transporter.sendMail({
      from: `"Contact Support" <${env.emailUser}>`,
      to: email,
      subject: 'Your OTP for Email Verification',
      text: `Your 6-digit OTP is: ${otp}.`,
      html: `<p>Your 6-digit OTP is: <strong>${otp}</strong></p>`,
    });

    res.status(200).json({ message: 'OTP sent!' });
  } catch (error) {
    console.error('Verification request error:', error);
    res.status(500).json({ message: 'Something went wrong while sending the OTP' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body as { email?: string; otp?: string };
    const verificationRecord = await EmailVerification.findOne({
      email: String(email),
      otp: String(otp),
    });

    if (!verificationRecord) {
      res.status(400).json({ message: 'Invalid OTP.' });
      return;
    }

    if (Date.now() - verificationRecord.createdAt.getTime() > OTP_EXPIRATION_MS) {
      res.status(400).json({ message: 'OTP has expired.' });
      return;
    }

    verificationRecord.isVerified = true;
    await verificationRecord.save();

    res.status(200).json({ message: 'Email successfully verified!' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Something went wrong while verifying the OTP.' });
  }
};
