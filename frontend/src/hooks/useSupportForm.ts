import { useMemo, useState } from 'react';
import { initialSupportForm } from '../constants/support';
import { submitSupportMessage } from '../services/supportApi';
import type { SubmitStatus, SupportForm } from '../types/support';

export const useSupportForm = () => {
  const [form, setForm] = useState<SupportForm>(initialSupportForm);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');

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

  const updateField =
    (field: keyof SupportForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus('sending');
    setStatusMessage('');

    try {
      await submitSupportMessage(form);
      setForm(initialSupportForm);
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
    updateField,
    handleSubmit,
  };
};
