import { useMemo, useState } from 'react'
import {
  Headphones,
  Mail,
  MessageSquareText,
  Send,
  UserRound,
} from 'lucide-react'
import './App.css'

type SupportForm = {
  name: string
  email: string
  message: string
}

const initialForm: SupportForm = {
  name: '',
  email: '',
  message: '',
}

function App() {
  const [form, setForm] = useState<SupportForm>(initialForm)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const preview = useMemo(
    () => ({
      name: form.name.trim() || 'Your name',
      email: form.email.trim() || 'your.email@example.com',
      message:
        form.message.trim() ||
        'Your support message will appear here as you type.',
    }),
    [form],
  )

  const updateField =
    (field: keyof SupportForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }))
    }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setStatus('sending')
    setStatusMessage('')

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/contact-support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to send your message.')
      }

      setForm(initialForm)
      setStatus('success')
      setStatusMessage('Your message was sent successfully.')
    } catch (error) {
      setStatus('error')
      setStatusMessage(
        error instanceof Error
          ? error.message
          : 'Unable to send your message.',
      )
    }
  }

  return (
    <main className="support-page">
      <section className="support-shell" aria-labelledby="support-title">
        <div className="support-form-panel">
          <p className="eyebrow">
            <Headphones size={16} aria-hidden="true" />
            Contact support
          </p>
          <h1 id="support-title">Contact Us</h1>

          <form className="support-form" onSubmit={handleSubmit}>
            <label htmlFor="name">
              Name
            </label>
            <div className="field-control">
              <UserRound size={18} aria-hidden="true" />
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
            </div>

            <label htmlFor="email">
              Email
            </label>
            <div className="field-control">
              <Mail size={18} aria-hidden="true" />
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
            </div>

            <label htmlFor="message">
              Message
            </label>
            <div className="field-control field-control-textarea">
              <MessageSquareText size={18} aria-hidden="true" />
              <textarea
                id="message"
                name="message"
                placeholder="Write your message here..."
                value={form.message}
                onChange={updateField('message')}
                rows={6}
                required
              />
            </div>

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

        <aside className="preview-panel" aria-labelledby="preview-title">
          <div className="preview-header">
            <p className="eyebrow">
              <MessageSquareText size={16} aria-hidden="true" />
              Live preview
            </p>
          </div>
          <h2 id="preview-title">Support request</h2>

          <div className="preview-card">
            <div>
              <span className="field-label">
                <UserRound size={14} aria-hidden="true" />
                From
              </span>
              <strong>{preview.name}</strong>
              <a href={`mailto:${preview.email}`}>{preview.email}</a>
            </div>

            <div>
              <span className="field-label">
                <MessageSquareText size={14} aria-hidden="true" />
                Message
              </span>
              <p>{preview.message}</p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
