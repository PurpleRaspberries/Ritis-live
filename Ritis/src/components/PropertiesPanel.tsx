// Visar och redigerar egenskaper för det objekt som är markerat på canvasen.
// Tar emot objekt och ändringsfunktioner från App och använder färgväljaren.
import type { Layer, Shape } from '../types';
import { translations, type Language } from '../i18n';
import { ColorPicker } from './ColorPicker';

interface PropertiesPanelProps {
  language: Language;
  selectedShape: Shape | null;
  onPositionChange: (axis: 'x' | 'y', value: number) => void;
  onSizeChange: (dimension: 'width' | 'height', value: number) => void;
  onTextChange: (text: string) => void;
  onTextSizeChange: (fontSize: number) => void;
  onLayerChange: (layer: Layer) => void;
  onColorChange: (color: string) => void;
}

export function PropertiesPanel({
  language,
  selectedShape,
  onPositionChange,
  onSizeChange,
  onTextChange,
  onTextSizeChange,
  onLayerChange,
  onColorChange,
}: PropertiesPanelProps) {
  const t = translations[language];
  const getPositionValue = (axis: 'x' | 'y') => {
    if (!selectedShape) return 0;
    if (selectedShape.type === 'circle') {
      return axis === 'x' ? selectedShape.cx : selectedShape.cy;
    }
    if (selectedShape.type === 'line') {
      return axis === 'x' ? selectedShape.x1 : selectedShape.y1;
    }
    return axis === 'x' ? selectedShape.x : selectedShape.y;
  };

  const getSizeValue = (dimension: 'width' | 'height') => {
    if (!selectedShape) return 0;
    if (selectedShape.type === 'circle') {
      const rx = selectedShape.rx ?? selectedShape.r;
      const ry = selectedShape.ry ?? selectedShape.r;
      return dimension === 'width' ? rx * 2 : ry * 2;
    }
    if (selectedShape.type === 'line') {
      return dimension === 'width'
        ? Math.abs(selectedShape.x2 - selectedShape.x1)
        : Math.abs(selectedShape.y2 - selectedShape.y1);
    }
    if (selectedShape.type === 'text') {
      return dimension === 'width' ? 0 : selectedShape.fontSize;
    }
    return dimension === 'width' ? selectedShape.width : selectedShape.height;
  };

  return (
    <aside
      style={{
        width: '220px',
        boxSizing: 'border-box',
        padding: '16px',
        borderLeft: '1px solid #ccc',
        background: '#f9fafb',
        textAlign: 'left',
      }}
    >
      <h2 style={{ marginTop: 0, fontSize: '18px' }}>{t.propertiesTitle}</h2>

      {!selectedShape ? (
        <p>{t.noSelection}</p>
      ) : (
        <>
          <label style={{ display: 'block', marginBottom: '12px' }}>
            {t.xPosition}
            <input
              type="number"
              value={getPositionValue('x')}
              onChange={(e) => onPositionChange('x', Number(e.target.value))}
              style={{ width: '100%', boxSizing: 'border-box', marginTop: '4px' }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '12px' }}>
            {t.yPosition}
            <input
              type="number"
              value={getPositionValue('y')}
              onChange={(e) => onPositionChange('y', Number(e.target.value))}
              style={{ width: '100%', boxSizing: 'border-box', marginTop: '4px' }}
            />
          </label>

          {selectedShape.type === 'text' ? (
            <>
              <label style={{ display: 'block', marginBottom: '12px' }}>
                {t.text}
                <input
                  type="text"
                  value={selectedShape.text}
                  onChange={(e) => onTextChange(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', marginTop: '4px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '12px' }}>
                {t.textSize}
                <input
                  type="number"
                  min={8}
                  value={selectedShape.fontSize}
                  onChange={(e) => onTextSizeChange(Number(e.target.value))}
                  style={{ width: '100%', boxSizing: 'border-box', marginTop: '4px' }}
                />
              </label>
            </>
          ) : (
            <>
              <label style={{ display: 'block', marginBottom: '12px' }}>
                {t.width}
                <input
                  type="number"
                  min={selectedShape.type === 'line' ? 0 : 10}
                  value={getSizeValue('width')}
                  onChange={(e) => onSizeChange('width', Number(e.target.value))}
                  style={{ width: '100%', boxSizing: 'border-box', marginTop: '4px' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '12px' }}>
                {t.height}
                <input
                  type="number"
                  min={selectedShape.type === 'line' ? 0 : 10}
                  value={getSizeValue('height')}
                  onChange={(e) => onSizeChange('height', Number(e.target.value))}
                  style={{ width: '100%', boxSizing: 'border-box', marginTop: '4px' }}
                />
              </label>
            </>
          )}

          <label style={{ display: 'block', marginBottom: '12px' }}>
            {t.layer}
            <select
              value={selectedShape.layer}
              onChange={(e) => onLayerChange(Number(e.target.value) as Layer)}
              style={{ width: '100%', boxSizing: 'border-box', marginTop: '4px' }}
            >
              {[1, 2, 3, 4, 5].map((layer) => (
                <option key={layer} value={layer}>{t.layerOption(layer)}</option>
              ))}
            </select>
          </label>

          {selectedShape.type !== 'rainbow' && (
            <>
              <ColorPicker color={selectedShape.color} onColorChange={onColorChange} language={language} />
            </>
          )}
        </>
      )}
    </aside>
  );
}
