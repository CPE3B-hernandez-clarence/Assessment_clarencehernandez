import type { ReactNode } from 'react';

type FieldControlProps = {
  children: ReactNode;
  icon?: ReactNode;
  textarea?: boolean;
};

export function FieldControl({ children, icon, textarea = false }: FieldControlProps) {
  return (
    <div className={`field-control${textarea ? ' field-control-textarea' : ''}`}>
      {icon && <span className="field-icon">{icon}</span>}
      {children}
    </div>
  );
}
