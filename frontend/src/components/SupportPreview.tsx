import { MessageSquareText, UserRound } from 'lucide-react';
import type { SupportForm } from '../types/support';

type SupportPreviewProps = {
  preview: SupportForm;
};

export function SupportPreview({ preview }: SupportPreviewProps) {
  return (
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
  );
}
