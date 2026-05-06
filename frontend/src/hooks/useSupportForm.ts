import { useEffect, useMemo, useState } from 'react';
import { initialSupportForm } from '../constants/support';
import {
  requestEmailVerification,
  submitSupportMessage,
  verifyEmailOtp,
} from '../services/supportApi';
import type { SubmitStatus, SupportForm, VerificationStatus } from '../types/support';

export const useSupportForm = () => {
  const [form, setForm] = useState<SupportForm>(initialSupportForm);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const preview = useMemo(
    () => ({
      name: form.name.trim() || 'Your name',
      email: form.email.trim() || 'your.email@example.com',
      message:
        form.message.trim() ||
        'Your support message will appear here as you type.',
    }),
    [form],
  );

  useEffect(() => {
    if (resendCountdown <= 0) {
      return;
    }

    const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const updateField =
    (field: keyof SupportForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));

      if (field === 'email') {
        setVerificationStatus('idle');
        setVerificationMessage('');
        setOtp('');
        setIsOtpSent(false);
      }
    };

  const updateOtp = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(event.target.value.replace(/\D/g, ''));
  };

  const handleVerifyEmail = async () => {
    if (!form.email) {
      setVerificationStatus('error');
      setVerificationMessage('Please enter your email first.');
      return;
    }

    setVerificationStatus('sending');
    setVerificationMessage('');

    try {
      await requestEmailVerification(form.email);
      setVerificationStatus('sent');
      setVerificationMessage('OTP sent! Check your email.');
      setResendCountdown(15);
      setIsOtpSent(true);
    } catch (error) {
      setVerificationStatus('error');
      setVerificationMessage(error instanceof Error ? error.message : 'Unable to send verification.');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setVerificationStatus('error');
      setVerificationMessage('Please enter the OTP.');
      return;
    }

    setVerificationStatus('sending');
    setVerificationMessage('');

    try {
      await verifyEmailOtp(form.email, otp);
      setVerificationStatus('verified');
      setVerificationMessage('Email verified successfully!');
    } catch (error) {
      setVerificationStatus('error');
      setVerificationMessage(error instanceof Error ? error.message : 'Unable to verify OTP.');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus('sending');
    setStatusMessage('');

    try {
      await submitSupportMessage(form);
      setForm(initialSupportForm);
      setVerificationStatus('idle');
      setVerificationMessage('');
      setOtp('');
      setIsOtpSent(false);
      setStatus('success');
      setStatusMessage('Your message was sent successfully.');
    } catch (error) {
      setStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Unable to send your message.');
    }
  };

  return {
    form,
    preview,
    status,
    statusMessage,
    verificationStatus,
    verificationMessage,
    otp,
    resendCountdown,
    isOtpSent,
    updateField,
    updateOtp,
    handleVerifyEmail,
    handleVerifyOtp,
    handleSubmit,
  };
};
