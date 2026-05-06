export type SupportForm = {
  name: string;
  email: string;
  message: string;
};

export type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

export type VerificationStatus = 'idle' | 'sending' | 'sent' | 'verified' | 'error';
