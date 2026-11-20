// Bekräftar om ritningen ska rensas innan den tas bort.
import { useLayoutEffect, useRef } from 'react';
import { translations, type Language } from '../i18n';

interface RestartConfirmationDialogProps {
  language: Language;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RestartConfirmationDialog({
  language,
  onConfirm,
  onCancel,
}: RestartConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const t = translations[language];

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    cancelButtonRef.current?.focus();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="restart-dialog"
      aria-modal="true"
      aria-labelledby="restart-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          onCancel();
        }
      }}
    >
      <span className="restart-dialog-icon" aria-hidden="true">🧹</span>
      <h2 id="restart-dialog-title">{t.restartDialogTitle}</h2>
      <div className="restart-dialog-actions">
        <button
          type="button"
          className="restart-dialog-button restart-dialog-confirm"
          aria-label={t.confirmRestartAriaLabel}
          onClick={onConfirm}
        >
          <span className="restart-dialog-button-icon" aria-hidden="true">✓</span>
          <span>{t.confirmRestart}</span>
        </button>
        <button
          ref={cancelButtonRef}
          type="button"
          className="restart-dialog-button restart-dialog-cancel"
          aria-label={t.cancelRestartAriaLabel}
          onClick={onCancel}
        >
          <span className="restart-dialog-button-icon" aria-hidden="true">✕</span>
          <span>{t.cancelRestart}</span>
        </button>
      </div>
    </dialog>
  );
}
