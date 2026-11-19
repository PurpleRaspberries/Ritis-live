// Ger användaren verktyg för att rita, välja färg och hantera ritningsfiler.
// Skickar val och åtgärder till App och återanvänder färgväljarkomponenten.
import { useRef } from 'react';
import type { Layer, Tool } from '../types';
import { ColorPicker } from './ColorPicker';

interface ToolbarProps {
  tool: Tool;
  setTool: (tool: Tool) => void;
  color: string;
  onColorChange: (color: string) => void;
  hasSelection: boolean;
  onDeleteSelected: () => void;
  onClearAll: () => void;
  onSave: () => void;
  onExportJpeg: () => void;
  onOpenFile: (file: File) => void;
  fileName: string;
  onFileNameChange: (fileName: string) => void;
  activeLayer: Layer;
  onLayerChange: (layer: Layer) => void;
}

export function Toolbar({
  tool,
  setTool,
  color,
  onColorChange,
  hasSelection,
  onDeleteSelected,
  onClearAll,
  onSave,
  onExportJpeg,
  onOpenFile,
  fileName,
  onFileNameChange,
  activeLayer,
  onLayerChange,
}: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onOpenFile(file);
      e.target.value = '';
    }
  };

  return (
    <div style={{ padding: '10px', background: '#f3f4f6', display: 'flex', gap: '10px', borderBottom: '1px solid #ccc', alignItems: 'center' }}>
      <button onClick={() => setTool('select')} style={{ fontWeight: tool === 'select' ? 'bold' : 'normal' }}>
        Markera / Flytta
      </button>
      <button onClick={() => setTool('rect')} style={{ fontWeight: tool === 'rect' ? 'bold' : 'normal' }}>
        Rektangel
      </button>
      <button onClick={() => setTool('circle')} style={{ fontWeight: tool === 'circle' ? 'bold' : 'normal' }}>
        Cirkel
      </button>
      <button onClick={() => setTool('line')} style={{ fontWeight: tool === 'line' ? 'bold' : 'normal' }}>
        Streck
      </button>
      <button onClick={() => setTool('text')} style={{ fontWeight: tool === 'text' ? 'bold' : 'normal' }}>
        Text
      </button>
      <button onClick={() => setTool('heart')} style={{ fontWeight: tool === 'heart' ? 'bold' : 'normal' }}>
        Hjärta
      </button>
      <button onClick={() => setTool('rabbit')} style={{ fontWeight: tool === 'rabbit' ? 'bold' : 'normal' }}>
        Kanin
      </button>
      <button onClick={() => setTool('rainbow')} style={{ fontWeight: tool === 'rainbow' ? 'bold' : 'normal' }}>
        Regnbåge
      </button>
      <button onClick={() => setTool('cloud')} style={{ fontWeight: tool === 'cloud' ? 'bold' : 'normal' }}>
        Moln
      </button>
      <button onClick={() => setTool('unicorn')} style={{ fontWeight: tool === 'unicorn' ? 'bold' : 'normal' }}>
        Enhörning
      </button>
      <ColorPicker color={color} onColorChange={onColorChange} popup />

      <label>
        Lager
        <select
          value={activeLayer}
          onChange={(e) => onLayerChange(Number(e.target.value) as Layer)}
          style={{ marginLeft: '6px' }}
        >
          {[1, 2, 3, 4, 5].map((layer) => (
            <option key={layer} value={layer}>Lager {layer}</option>
          ))}
        </select>
      </label>

      {hasSelection && (
        <button onClick={onDeleteSelected} style={{ color: 'red' }}>
          Ta bort markerad
        </button>
      )}

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={fileName}
          onChange={(e) => onFileNameChange(e.target.value)}
          placeholder="Filnamn"
          aria-label="Filnamn"
          style={{ width: '140px' }}
        />
        <button onClick={onSave}>Spara</button>
        <button onClick={onExportJpeg}>Exportera JPEG</button>
        <button onClick={() => fileInputRef.current?.click()}>Öppna</button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button onClick={onClearAll}>Rensa allt</button>
      </div>
    </div>
  );
}
