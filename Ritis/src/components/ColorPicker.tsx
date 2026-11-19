// Visar färgpaletten och hanterar val av färg eller egen färg.
// Används både fristående i egenskapspanelen och som popup i verktygsfältet.
import { useRef } from 'react';

const colors = [
  { name: 'Röd', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Gul', value: '#facc15' },
  { name: 'Grön', value: '#22c55e' },
  { name: 'Blå', value: '#3b82f6' },
  { name: 'Lila', value: '#a855f7' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Svart', value: '#1f2937' },
];

interface ColorPickerProps {
  color: string;
  onColorChange: (color: string) => void;
  popup?: boolean;
}

export function ColorPicker({ color, onColorChange, popup = false }: ColorPickerProps) {
  const popupRef = useRef<HTMLDetailsElement>(null);

  const handleColorSelect = (newColor: string) => {
    onColorChange(newColor);
    if (popupRef.current) popupRef.current.open = false;
  };

  const renderPalette = () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: '8px',
        padding: popup ? '12px' : '0',
      }}
    >
      {colors.map(({ name, value }) => (
        <button
          key={value}
          type="button"
          title={name}
          aria-label={`Välj färgen ${name}`}
          aria-pressed={color.toLowerCase() === value}
          onClick={() => handleColorSelect(value)}
          style={{
            width: '100%',
            height: popup ? '52px' : '40px',
            minWidth: 0,
            padding: '4px',
            borderRadius: '8px',
            border: color.toLowerCase() === value ? '4px solid #111827' : '2px solid #d1d5db',
            background: value,
            cursor: 'pointer',
          }}
        />
      ))}
      <label
        style={{
          gridColumn: 'span 4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '4px',
          fontSize: '14px',
        }}
      >
        Egen färg
        <input
          type="color"
          value={color}
          aria-label="Välj en egen färg"
          onChange={(e) => handleColorSelect(e.target.value)}
          style={{ width: '56px', height: '40px', cursor: 'pointer' }}
        />
      </label>
    </div>
  );

  if (!popup) {
    return (
      <div>
        <div style={{ marginBottom: '8px' }}>Färg</div>
        {renderPalette()}
      </div>
    );
  }

  return (
    <details ref={popupRef} style={{ position: 'relative' }}>
      <summary
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          minHeight: '48px',
          padding: '4px 10px',
          border: '1px solid #9ca3af',
          borderRadius: '6px',
          background: 'white',
          cursor: 'pointer',
          listStylePosition: 'inside',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: color,
            border: '2px solid #374151',
          }}
        />
        Färg
      </summary>
      <div
        style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          zIndex: 10,
          width: 'min(280px, 85vw)',
          border: '1px solid #9ca3af',
          borderRadius: '8px',
          background: 'white',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        }}
      >
        {renderPalette()}
      </div>
    </details>
  );
}
