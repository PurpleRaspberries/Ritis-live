// Visar ritverktyg, figurmeny och inställningar för canvasbakgrunden.
// Skickar användarens val samt filåtgärder vidare till App.
import { useEffect, useRef, useState } from 'react';
import type { Layer, Tool } from '../types';
import { isLanguage, translations, type Language } from '../i18n';
import { BackgroundSettingsDialog } from './BackgroundSettingsDialog';
import { AboutDialog } from './AboutDialog';

interface ToolbarProps {
  tool: Tool;
  setTool: (tool: Tool) => void;
  hasSelection: boolean;
  onDeleteSelected: () => void;
  onRestartRequest: () => void;
  onSaveExport: () => void;
  onOpenFile: (file: File) => void;
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
  { tool: 'freehand', icon: '✏️' },
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
  { tool: 'sun', icon: '☀️' },
  { tool: 'star', icon: '⭐' },
  { tool: 'gingerbread', icon: '🍪' },
  { tool: 'flower', icon: '🌼' },
  { tool: 'leaf', icon: '🍃' },
];

const languages: Language[] = ['sv', 'en', 'de'];

export function Toolbar({
  tool,
  setTool,
  hasSelection,
  onDeleteSelected,
  onRestartRequest,
  onSaveExport,
  onOpenFile,
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
  const [backgroundDialogOpen, setBackgroundDialogOpen] = useState(false);
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);

  // Stäng öppna menyer när klicket sker utanför dem, men låt menyinnehållet vara interaktivt.
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
            onClick={onRestartRequest}
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

          <button
            type="button"
            className="toolbar-background-open"
            onClick={() => handleMoreMenuAction(() => setBackgroundDialogOpen(true))}
          >
            <span
              className={`toolbar-background-preview${backgroundTransparent ? ' is-transparent' : ''}`}
              style={backgroundTransparent ? undefined : { backgroundColor }}
              aria-hidden="true"
            />
            <span>{backgroundTransparent ? t.transparentBackground : t.backgroundColor}</span>
          </button>

          <div className="toolbar-actions">
            <button type="button" onClick={() => handleMoreMenuAction(onSaveExport)}>💾 {t.saveOrExport}</button>
            <button type="button" onClick={() => handleMoreMenuAction(() => fileInputRef.current?.click())}>📂 {t.openDrawing}</button>
            <button type="button" onClick={() => handleMoreMenuAction(() => setAboutDialogOpen(true))}>ℹ️ {t.about}</button>
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
      {backgroundDialogOpen && (
        <BackgroundSettingsDialog
          language={language}
          backgroundColor={backgroundColor}
          backgroundTransparent={backgroundTransparent}
          onConfirm={(nextColor, nextTransparent) => {
            onBackgroundColorChange(nextColor);
            onBackgroundTransparentChange(nextTransparent);
            setBackgroundDialogOpen(false);
          }}
          onCancel={() => setBackgroundDialogOpen(false)}
        />
      )}
      {aboutDialogOpen && (
        <AboutDialog
          language={language}
          onClose={() => setAboutDialogOpen(false)}
        />
      )}
    </header>
  );
}
