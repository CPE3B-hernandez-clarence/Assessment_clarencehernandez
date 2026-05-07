import { Router } from 'express';
import { createContactSupportMessage } from '../controllers/contactSupportController';

const supportRoutes = Router();

supportRoutes.post('/contact-support', createContactSupportMessage);

export default supportRoutes;
