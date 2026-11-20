// Beskriver Ritis och dess ritfunktioner i en modal informationsruta.
import { useLayoutEffect, useRef } from 'react';
import { translations, type Language } from '../i18n';

interface AboutDialogProps {
  language: Language;
  onClose: () => void;
}

export function AboutDialog({ language, onClose }: AboutDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const t = translations[language];

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    closeButtonRef.current?.focus();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="restart-dialog about-dialog"
      aria-modal="true"
      aria-labelledby="about-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          onClose();
        }
      }}
    >
      <span className="restart-dialog-icon" aria-hidden="true">🎨</span>
      <h2 id="about-dialog-title">{t.aboutTitle}</h2>
      <p className="about-dialog-description">{t.aboutDescription}</p>
      <div className="about-dialog-actions">
        <button
          ref={closeButtonRef}
          type="button"
          className="restart-dialog-button restart-dialog-confirm about-dialog-close"
          onClick={onClose}
        >
          {t.closeAbout}
        </button>
      </div>
    </dialog>
  );
}
