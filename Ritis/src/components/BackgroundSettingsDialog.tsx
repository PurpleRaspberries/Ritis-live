// Låter användaren välja färg eller transparens innan bakgrunden ändras.
import { useLayoutEffect, useRef, useState } from 'react';
import { translations, type Language } from '../i18n';

interface BackgroundSettingsDialogProps {
  language: Language;
  backgroundColor: string;
  backgroundTransparent: boolean;
  backgroundOpacity: number;
  onConfirm: (color: string, transparent: boolean, opacity: number) => void;
  onCancel: () => void;
}

export function BackgroundSettingsDialog({
  language,
  backgroundColor,
  backgroundTransparent,
  backgroundOpacity,
  onConfirm,
  onCancel,
}: BackgroundSettingsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const [draftColor, setDraftColor] = useState(backgroundColor);
  const [draftOpacity, setDraftOpacity] = useState(backgroundTransparent ? 0 : backgroundOpacity);
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
      <div className="background-dialog-options">
        <div className="background-dialog-option background-dialog-color-option">
          <span>{t.backgroundColor}</span>
          <input
            className="background-dialog-color-input"
            type="color"
            value={draftColor}
            aria-label={t.backgroundColor}
            onChange={(event) => {
              setDraftColor(event.target.value);
            }}
          />
          <label className="opacity-setting background-opacity-setting">
            <span>{t.opacity}: {Math.round((1 - draftOpacity) * 100)}%</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={Math.round((1 - draftOpacity) * 100)}
              aria-label={t.opacity}
              onChange={(event) => setDraftOpacity(1 - Number(event.target.value) / 100)}
            />
          </label>
        </div>
      </div>
      {draftOpacity < 1 && (
        <p className="toolbar-note background-dialog-note">{t.jpegTransparencyNote}</p>
      )}
      <div className="restart-dialog-actions">
        <button
          type="button"
          className="restart-dialog-button restart-dialog-confirm"
          onClick={() => onConfirm(draftColor, draftOpacity === 0, draftOpacity)}
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
