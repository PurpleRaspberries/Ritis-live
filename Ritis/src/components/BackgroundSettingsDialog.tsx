// Låter användaren välja färg eller transparens innan bakgrunden ändras.
import { useLayoutEffect, useRef, useState } from 'react';
import { translations, type Language } from '../i18n';

interface BackgroundSettingsDialogProps {
  language: Language;
  backgroundColor: string;
  backgroundTransparent: boolean;
  onConfirm: (color: string, transparent: boolean) => void;
  onCancel: () => void;
}

export function BackgroundSettingsDialog({
  language,
  backgroundColor,
  backgroundTransparent,
  onConfirm,
  onCancel,
}: BackgroundSettingsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const [draftColor, setDraftColor] = useState(backgroundColor);
  const [draftTransparent, setDraftTransparent] = useState(backgroundTransparent);
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
      className="restart-dialog background-settings-dialog"
      aria-modal="true"
      aria-labelledby="background-dialog-title"
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
      <span className="restart-dialog-icon" aria-hidden="true">🎨</span>
      <h2 id="background-dialog-title">{t.backgroundDialogTitle}</h2>
      <div className="background-dialog-options" role="radiogroup" aria-label={t.backgroundDialogTitle}>
        <div className="background-dialog-option">
          <label className="background-dialog-choice">
            <input
              type="radio"
              name="background-mode"
              checked={!draftTransparent}
              onChange={() => setDraftTransparent(false)}
            />
            <span>{t.backgroundColor}</span>
          </label>
          <input
            className="background-dialog-color-input"
            type="color"
            value={draftColor}
            aria-label={t.backgroundColor}
            disabled={draftTransparent}
            onChange={(event) => {
              setDraftColor(event.target.value);
              setDraftTransparent(false);
            }}
          />
        </div>
        <label className="background-dialog-option background-dialog-choice">
          <input
            type="radio"
            name="background-mode"
            checked={draftTransparent}
            onChange={() => setDraftTransparent(true)}
          />
          <span>{t.transparentBackground}</span>
          <span className="background-dialog-transparent-preview" aria-hidden="true" />
        </label>
      </div>
      {draftTransparent && (
        <p className="toolbar-note background-dialog-note">{t.jpegTransparencyNote}</p>
      )}
      <div className="restart-dialog-actions">
        <button
          type="button"
          className="restart-dialog-button restart-dialog-confirm"
          onClick={() => onConfirm(draftColor, draftTransparent)}
        >
          <span>{t.confirmBackground}</span>
        </button>
        <button
          ref={cancelButtonRef}
          type="button"
          className="restart-dialog-button restart-dialog-cancel"
          onClick={onCancel}
        >
          <span>{t.cancelBackground}</span>
        </button>
      </div>
    </dialog>
  );
}
