import { type ReactNode, useEffect } from 'react';
import './Modal.css';

interface ModalShellProps {
  title: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  small?: boolean;
}

export default function ModalShell({ title, subtitle, onClose, children, small }: ModalShellProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`modal ${small ? 'modal--small' : ''}`} role="dialog" aria-modal="true">
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <h2 className="modal__title">{title}</h2>
        {subtitle && <div className="modal__subtitle">{subtitle}</div>}
        {children}
      </div>
    </div>
  );
}
