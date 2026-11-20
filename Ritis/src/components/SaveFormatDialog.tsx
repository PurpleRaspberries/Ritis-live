// Låter användaren välja filformat när webbläsaren saknar en inbyggd filväljare.
import { useLayoutEffect, useRef, useState } from 'react';
import type { DrawingFileFormat } from '../types';
import { translations, type Language } from '../i18n';

interface SaveFormatDialogProps {
  language: Language;
  fileName: string;
  onSelect: (format: DrawingFileFormat, fileName: string) => void;
  onCancel: () => void;
}

export function SaveFormatDialog({ language, fileName, onSelect, onCancel }: SaveFormatDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const [draftFileName, setDraftFileName] = useState(fileName);
  const t = translations[language];
  const formats: Array<{ format: DrawingFileFormat; icon: string; label: string }> = [
    { format: 'json', icon: '💾', label: t.save },
    { format: 'png', icon: '🖼️', label: t.saveAsPng },
    { format: 'jpeg', icon: '🖼️', label: t.saveAsJpeg },
    { format: 'svg', icon: '📐', label: t.saveAsSvg },
  ];

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
      className="restart-dialog save-format-dialog"
      aria-modal="true"
      aria-labelledby="save-format-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
    >
      <h2 id="save-format-dialog-title">{t.saveFormatTitle}</h2>
      <label className="save-format-name">
        {t.imageName}
        <input
          type="text"
          value={draftFileName}
          onChange={(event) => setDraftFileName(event.target.value)}
        />
      </label>
      <div className="save-format-actions">
        {formats.map(({ format, icon, label }) => (
          <button
            key={format}
            type="button"
            className="save-format-button"
            onClick={() => onSelect(format, draftFileName)}
          >
            <span aria-hidden="true">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
      <button
        ref={cancelButtonRef}
        type="button"
        className="save-format-cancel"
        onClick={onCancel}
      >
        {t.cancelSave}
      </button>
    </dialog>
  );
}
