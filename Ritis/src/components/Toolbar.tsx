// Visar ritverktyg, figurmeny och inställningar för färg och canvasbakgrund.
// Skickar användarens val samt filåtgärder vidare till App.
import { useEffect, useRef } from 'react';
import type { Layer, Tool } from '../types';
import { isLanguage, translations, type Language } from '../i18n';
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
  onExportPng: () => void;
  onExportSvg: () => void;
  onOpenFile: (file: File) => void;
  fileName: string;
  onFileNameChange: (fileName: string) => void;
  activeLayer: Layer;
  onLayerChange: (layer: Layer) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
  backgroundColor: string;
  backgroundTransparent: boolean;
  onBackgroundColorChange: (color: string) => void;
  onBackgroundTransparentChange: (transparent: boolean) => void;
}

const tools: Array<{ tool: Tool; icon: string }> = [
  { tool: 'select', icon: '👆' },
  { tool: 'rect', icon: '🟦' },
  { tool: 'circle', icon: '🔵' },
  { tool: 'line', icon: '〰️' },
  { tool: 'text', icon: '🔤' },
];

const shapeTools: Array<{ tool: Tool; icon: string }> = [
  { tool: 'heart', icon: '❤️' },
  { tool: 'rabbit', icon: '🐰' },
  { tool: 'rainbow', icon: '🌈' },
  { tool: 'cloud', icon: '☁️' },
  { tool: 'unicorn', icon: '🦄' },
];

const languages: Language[] = ['sv', 'en', 'de'];

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
  onExportPng,
  onExportSvg,
  onOpenFile,
  fileName,
  onFileNameChange,
  activeLayer,
  onLayerChange,
  language,
  onLanguageChange,
  backgroundColor,
  backgroundTransparent,
  onBackgroundColorChange,
  onBackgroundTransparentChange,
}: ToolbarProps) {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shapeMenuRef = useRef<HTMLDetailsElement>(null);
  const moreMenuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const closeMenusOnOutsideClick = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      [moreMenuRef.current, shapeMenuRef.current].forEach((menu) => {
        if (menu?.open && !menu.contains(target)) {
          menu.open = false;
        }
      });
    };

    document.addEventListener('pointerdown', closeMenusOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeMenusOnOutsideClick);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onOpenFile(file);
      e.target.value = '';
    }
  };

  const handleShapeToolSelect = (shapeTool: Tool) => {
    setTool(shapeTool);
    if (shapeMenuRef.current) shapeMenuRef.current.open = false;
  };

  const handleMoreMenuAction = (action: () => void) => {
    if (moreMenuRef.current) moreMenuRef.current.open = false;
    action();
  };

  return (
    <header className="toolbar">
      <div className="toolbar-main">
        <div className="toolbar-heading">
          <h1 className="toolbar-title">{t.appTitle}</h1>
          <p className="toolbar-instruction" aria-live="polite">{t.toolInstructions[tool]}</p>
        </div>
        <div className="toolbar-color">
          <ColorPicker color={color} onColorChange={onColorChange} popup language={language} />
        </div>
        <div className="toolbar-tools" role="group" aria-label={t.toolsAriaLabel}>
          {tools.map(({ tool: toolName, icon }) => (
            <button
              key={toolName}
              type="button"
              className={`toolbar-tool${tool === toolName ? ' is-active' : ''}`}
              onClick={() => setTool(toolName)}
              aria-pressed={tool === toolName}
            >
              <span className="toolbar-tool-icon" aria-hidden="true">{icon}</span>
              <span>{t.toolLabels[toolName]}</span>
            </button>
          ))}
          <details ref={shapeMenuRef} className="toolbar-shapes-menu">
            <summary className={`toolbar-tool toolbar-shapes-trigger${shapeTools.some(({ tool: shapeTool }) => shapeTool === tool) ? ' is-active' : ''}`}>
              <span className="toolbar-tool-icon" aria-hidden="true">✨</span>
              <span>{t.figures}</span>
            </summary>
            <div className="toolbar-shapes-panel" role="group" aria-label={t.additionalFigures}>
              {shapeTools.map(({ tool: shapeTool, icon }) => (
                <button
                  key={shapeTool}
                  type="button"
                  className={`toolbar-tool${tool === shapeTool ? ' is-active' : ''}`}
                  onClick={() => handleShapeToolSelect(shapeTool)}
                  aria-pressed={tool === shapeTool}
                >
                  <span className="toolbar-tool-icon" aria-hidden="true">{icon}</span>
                  <span>{t.toolLabels[shapeTool]}</span>
                </button>
              ))}
            </div>
          </details>
          {hasSelection && (
            <button
              type="button"
              className="toolbar-tool toolbar-delete"
              onClick={onDeleteSelected}
            >
              <span className="toolbar-tool-icon" aria-hidden="true">🗑️</span>
              <span>{t.deleteSelected}</span>
            </button>
          )}
          <button
            type="button"
            className="toolbar-tool toolbar-reset"
            onClick={onClearAll}
            aria-label={t.restartAriaLabel}
          >
            <span className="toolbar-tool-icon" aria-hidden="true">🧹</span>
            <span>{t.restart}</span>
          </button>
        </div>
      </div>

      <details ref={moreMenuRef} className="toolbar-more">
        <summary>⚙️ {t.moreOptions}</summary>
        <div className="toolbar-more-panel">
          <label className="toolbar-setting">
            {t.languageLabel}
            <select
              aria-label={t.languageAriaLabel}
              value={language}
              onChange={(e) => {
                const nextLanguage = e.target.value;
                if (isLanguage(nextLanguage)) {
                  handleMoreMenuAction(() => onLanguageChange(nextLanguage));
                }
              }}
            >
              {languages.map((option) => (
                <option key={option} value={option}>{t.languageNames[option]}</option>
              ))}
            </select>
          </label>

          <label className="toolbar-setting">
            {t.layer}
            <select
              value={activeLayer}
              onChange={(e) => handleMoreMenuAction(() => onLayerChange(Number(e.target.value) as Layer))}
            >
              {[1, 2, 3, 4, 5].map((layer) => (
                <option key={layer} value={layer}>{t.layerOption(layer)}</option>
              ))}
            </select>
          </label>

          <label className="toolbar-setting">
            {t.imageName}
            <input
              type="text"
              value={fileName}
              onChange={(e) => onFileNameChange(e.target.value)}
              aria-label={t.imageName}
            />
          </label>

          <label className="toolbar-setting">
            {t.backgroundColor}
            <input
              type="color"
              value={backgroundColor}
              aria-label={t.backgroundColor}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
            />
          </label>

          <label className="toolbar-background-toggle">
            <input
              type="checkbox"
              checked={backgroundTransparent}
              onChange={(e) => onBackgroundTransparentChange(e.target.checked)}
            />
            {t.transparentBackground}
          </label>
          {backgroundTransparent && (
            <p className="toolbar-note">{t.jpegTransparencyNote}</p>
          )}

          <div className="toolbar-actions">
            <button type="button" onClick={() => handleMoreMenuAction(onSave)}>💾 {t.save}</button>
            <button type="button" onClick={() => handleMoreMenuAction(onExportJpeg)}>🖼️ {t.saveAsJpeg}</button>
            <button type="button" onClick={() => handleMoreMenuAction(onExportPng)}>🖼️ {t.saveAsPng}</button>
            <button type="button" onClick={() => handleMoreMenuAction(onExportSvg)}>📐 {t.saveAsSvg}</button>
            <button type="button" onClick={() => handleMoreMenuAction(() => fileInputRef.current?.click())}>📂 {t.openDrawing}</button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="toolbar-file-input"
          />
        </div>
      </details>
    </header>
  );
}
