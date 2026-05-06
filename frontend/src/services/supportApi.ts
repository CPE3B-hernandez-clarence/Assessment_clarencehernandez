import { API_URL } from '../constants/support';
import type { SupportForm } from '../types/support';

type ApiMessage = {
  message?: string;
};

const parseApiMessage = async (response: Response): Promise<ApiMessage> => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

const postJson = async <TBody>(path: string, body: TBody, fallbackMessage: string) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const result = await parseApiMessage(response);

  if (!response.ok) {
    throw new Error(result.message || fallbackMessage);
  }

  return result;
};

export const requestEmailVerification = (email: string) =>
  postJson('/verify-email-request', { email }, 'Unable to send verification email.');

export const verifyEmailOtp = (email: string, otp: string) =>
  postJson('/verify-otp', { email, otp }, 'Invalid or expired OTP.');

export const submitSupportMessage = (form: SupportForm) =>
  postJson('/contact-support', form, 'Unable to send your message.');
