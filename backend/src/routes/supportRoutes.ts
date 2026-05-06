import { Router } from 'express';
import { createContactSupportMessage } from '../controllers/contactSupportController';
import {
  requestEmailVerification,
  verifyOtp,
} from '../controllers/emailVerificationController';

const supportRoutes = Router();

supportRoutes.post('/verify-email-request', requestEmailVerification);
supportRoutes.post('/verify-otp', verifyOtp);
supportRoutes.post('/contact-support', createContactSupportMessage);

export default supportRoutes;
