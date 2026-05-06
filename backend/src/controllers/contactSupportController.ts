import type { Request, Response } from 'express';
import { env } from '../config/env';
import { canSendMail, transporter } from '../config/mailer';
import { buildSupportEmailHtml } from '../emails/supportEmail';
import ContactSupport from '../models/ContactSupport';
import EmailVerification from '../models/EmailVerification';

export const createContactSupportMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body as {
      name?: string;
      email?: string;
      message?: string;
    };

    if (!name || !email || !message) {
      res.status(400).json({
        message: 'Name, email, and message are required',
      });
      return;
    }

    const verifiedRecord = await EmailVerification.findOne({ email, isVerified: true });
    if (!verifiedRecord) {
      res.status(403).json({
        message: 'Please verify your email before submitting.',
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

    if (canSendMail && env.supportEmail) {
      try {
        await transporter.sendMail({
          from: `"Contact Support" <${env.emailUser}>`,
          replyTo: email,
          to: env.supportEmail,
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

    await EmailVerification.deleteOne({ email });
  } catch (error) {
    console.error('Contact support error:', error);

    res.status(500).json({
      message: 'Something went wrong while sending the contact support message',
    });
  }
};
