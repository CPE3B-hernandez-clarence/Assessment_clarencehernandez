import type { ChangeEvent, FormEvent } from 'react';
import {
  Headphones,
  Mail,
  MessageSquareText,
  Send,
  UserRound,
} from 'lucide-react';
import { FieldControl } from './FieldControl';
import type { SubmitStatus, SupportForm } from '../types/support';

type SupportFormPanelProps = {
  form: SupportForm;
  status: SubmitStatus;
  statusMessage: string;
  updateField: (
    field: keyof SupportForm,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export function SupportFormPanel({
  form,
  status,
  statusMessage,
  updateField,
  handleSubmit,
}: SupportFormPanelProps) {
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
        <FieldControl icon={<Mail size={18} aria-hidden="true" />}>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={updateField('email')}
            autoComplete="email"
            required
          />
        </FieldControl>

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
