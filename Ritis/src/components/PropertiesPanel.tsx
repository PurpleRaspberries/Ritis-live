// Visar och redigerar egenskaper för det objekt som är markerat på canvasen.
// Tar emot objekt och ändringsfunktioner från App och använder färgväljaren.
import { textFontFamilies, type Layer, type Shape, type TextFontFamily, type Tool } from '../types';
import { translations, type Language } from '../i18n';
import { ColorPicker } from './ColorPicker';

interface PropertiesPanelProps {
  language: Language;
  tool: Tool;
  penWidth: number;
  penColor: string;
  onPenWidthChange: (width: number) => void;
  selectedShape: Shape | null;
  onPositionChange: (axis: 'x' | 'y', value: number) => void;
  onSizeChange: (dimension: 'width' | 'height', value: number) => void;
  onTextChange: (text: string) => void;
  onTextSizeChange: (fontSize: number) => void;
  onTextFontChange: (fontFamily: TextFontFamily) => void;
  onLayerChange: (layer: Layer) => void;
  onColorChange: (color: string) => void;
}

export function PropertiesPanel({
  language,
  tool,
  penWidth,
  penColor,
  onPenWidthChange,
  selectedShape,
  onPositionChange,
  onSizeChange,
  onTextChange,
  onTextSizeChange,
  onTextFontChange,
  onLayerChange,
  onColorChange,
}: PropertiesPanelProps) {
  const t = translations[language];
  // Ett markerat streck visar sina egna värden; annars visas inställningarna för nästa streck.
  const selectedStrokeWidth = selectedShape?.type === 'line'
    ? selectedShape.strokeWidth ?? 4
    : selectedShape?.type === 'freehand'
      ? selectedShape.strokeWidth
      : null;
  const showsPenWidth = tool === 'freehand' || tool === 'line' || selectedStrokeWidth !== null;
  const displayedPenWidth = selectedStrokeWidth ?? penWidth;
  const displayedPenColor = selectedShape && selectedShape.type !== 'rainbow'
    ? selectedShape.color
    : penColor;
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
    <div
      style={{
        width: '220px',
        boxSizing: 'border-box',
        borderLeft: '1px solid #ccc',
        background: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      <div className="properties-color-setting">
        <ColorPicker color={displayedPenColor} onColorChange={onColorChange} language={language} />
      </div>
      {showsPenWidth && (
        <div className="pen-width-setting" style={{ margin: '16px 16px 0' }}>
          <label htmlFor="pen-width-slider">{t.penThickness}</label>
          <div className="pen-width-slider-row">
            <span className="pen-width-endpoint pen-width-small" aria-hidden="true" />
            <input
              id="pen-width-slider"
              type="range"
              min={4}
              max={32}
              step={2}
              value={displayedPenWidth}
              aria-label={t.penThickness}
              onChange={(event) => onPenWidthChange(Number(event.target.value))}
            />
            <span className="pen-width-endpoint pen-width-large" aria-hidden="true" />
          </div>
          <svg className="pen-width-preview" viewBox="0 0 100 40" aria-hidden="true">
            <line
              x1="14"
              y1="20"
              x2="86"
              y2="20"
              stroke={displayedPenColor}
              strokeWidth={displayedPenWidth}
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
      <aside
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '16px',
          textAlign: 'left',
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: '18px' }}>{t.propertiesTitle}</h2>
        {!selectedShape ? (
          showsPenWidth ? null : <p>{t.noSelection}</p>
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

                <label style={{ display: 'block', marginBottom: '12px' }}>
                  {t.fontFamily}
                  <select
                    value={selectedShape.fontFamily ?? 'Arial, sans-serif'}
                    onChange={(event) => {
                      const selectedFont = textFontFamilies.find(({ value }) => value === event.target.value);
                      if (selectedFont) onTextFontChange(selectedFont.value);
                    }}
                    style={{ width: '100%', boxSizing: 'border-box', marginTop: '4px' }}
                  >
                    {textFontFamilies.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
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
          </>
        )}
      </aside>
    </div>
  );
}
