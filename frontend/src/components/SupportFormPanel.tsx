import type { ChangeEvent, FormEvent } from 'react';
import {
  Headphones,
  Mail,
  MessageSquareText,
  Send,
  UserRound,
} from 'lucide-react';
import { FieldControl } from './FieldControl';
import type { SubmitStatus, SupportForm, VerificationStatus } from '../types/support';

type SupportFormPanelProps = {
  form: SupportForm;
  status: SubmitStatus;
  statusMessage: string;
  verificationStatus: VerificationStatus;
  verificationMessage: string;
  otp: string;
  resendCountdown: number;
  isOtpSent: boolean;
  updateField: (
    field: keyof SupportForm,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  updateOtp: (event: ChangeEvent<HTMLInputElement>) => void;
  handleVerifyEmail: () => Promise<void>;
  handleVerifyOtp: () => Promise<void>;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

const getOtpButtonText = (
  verificationStatus: VerificationStatus,
  resendCountdown: number,
  isOtpSent: boolean,
) => {
  if (verificationStatus === 'sending') {
    return 'Sending...';
  }

  if (resendCountdown > 0) {
    return `Resend in ${resendCountdown}s`;
  }

  return isOtpSent ? 'Resend OTP' : 'Send OTP';
};

export function SupportFormPanel({
  form,
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
}: SupportFormPanelProps) {
  const showOtpInput = isOtpSent && verificationStatus !== 'verified';

  return (
    <div className="support-form-panel">
      <p className="eyebrow">
        <Headphones size={16} aria-hidden="true" />
        Contact support
      </p>
      <h1 id="support-title">Contact Us</h1>

      <form className="support-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <FieldControl icon={<UserRound size={18} aria-hidden="true" />}>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={updateField('name')}
            autoComplete="name"
            required
          />
        </FieldControl>

        <label htmlFor="email">Email</label>
        <div className="verification-row">
          <FieldControl icon={<Mail size={18} aria-hidden="true" />}>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={updateField('email')}
              autoComplete="email"
              disabled={verificationStatus === 'verified'}
              required
            />
          </FieldControl>

          {verificationStatus !== 'verified' && (
            <button
              className="secondary-action"
              type="button"
              onClick={handleVerifyEmail}
              disabled={verificationStatus === 'sending' || !form.email || resendCountdown > 0}
            >
              {getOtpButtonText(verificationStatus, resendCountdown, isOtpSent)}
            </button>
          )}
        </div>

        {showOtpInput && (
          <div className="verification-row">
            <FieldControl>
              <input
                id="otp"
                name="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={updateOtp}
                maxLength={6}
                required
              />
            </FieldControl>
            <button
              className="secondary-action"
              type="button"
              onClick={handleVerifyOtp}
              disabled={!otp || otp.length < 6 || verificationStatus === 'sending'}
            >
              Verify OTP
            </button>
          </div>
        )}

        {verificationMessage && (
          <p
            className={`form-status form-status-${
              verificationStatus === 'verified' ? 'success' : verificationStatus
            }`}
            role="status"
          >
            {verificationMessage}
          </p>
        )}

        <label htmlFor="message">Message</label>
        <FieldControl textarea icon={<MessageSquareText size={18} aria-hidden="true" />}>
          <textarea
            id="message"
            name="message"
            placeholder="Write your message here..."
            value={form.message}
            onChange={updateField('message')}
            rows={6}
            required
          />
        </FieldControl>

        <button type="submit" disabled={status === 'sending'}>
          <Send size={18} aria-hidden="true" />
          {status === 'sending' ? 'Sending...' : 'Submit request'}
        </button>

        {statusMessage && (
          <p className={`form-status form-status-${status}`} role="status">
            {statusMessage}
          </p>
        )}
      </form>
    </div>
  );
}
