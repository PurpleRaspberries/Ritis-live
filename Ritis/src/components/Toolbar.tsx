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
  canUndo: boolean;
  canRedo: boolean;
  onDuplicateSelected: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onRestartRequest: () => void;
  onSaveExport: () => void;
  onOpenFile: (file: File) => void;
  activeLayer: Layer;
  onLayerChange: (layer: Layer) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
  backgroundColor: string;
  backgroundTransparent: boolean;
  backgroundOpacity: number;
  onBackgroundColorChange: (color: string) => void;
  onBackgroundTransparentChange: (transparent: boolean) => void;
  onBackgroundOpacityChange: (opacity: number) => void;
  gridEnabled: boolean;
  gridSize: number;
  onGridEnabledChange: (enabled: boolean) => void;
  onGridSizeChange: (size: number) => void;
}

const basicShapeTools: Array<{ tool: Tool; icon: string }> = [
  { tool: 'freehand', icon: '✏️' },
  { tool: 'rect', icon: '🟦' },
  { tool: 'circle', icon: '🔵' },
  { tool: 'line', icon: '〰️' },
  { tool: 'text', icon: '🔤' },
  { tool: 'spiderweb', icon: '🕸️' },
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

function hexToRgbaPreview(hex: string, opacity: number): string {
  const normalized = hex.replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return hex;
  return `rgba(${parseInt(normalized.slice(0, 2), 16)}, ${parseInt(normalized.slice(2, 4), 16)}, ${parseInt(normalized.slice(4, 6), 16)}, ${opacity})`;
}

export function Toolbar({
  tool,
  setTool,
  hasSelection,
  canUndo,
  canRedo,
  onDuplicateSelected,
  onUndo,
  onRedo,
  onRestartRequest,
  onSaveExport,
  onOpenFile,
  activeLayer,
  onLayerChange,
  language,
  onLanguageChange,
  backgroundColor,
  backgroundTransparent,
  backgroundOpacity,
  onBackgroundColorChange,
  onBackgroundTransparentChange,
  onBackgroundOpacityChange,
  gridEnabled,
  gridSize,
  onGridEnabledChange,
  onGridSizeChange,
}: ToolbarProps) {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shapeMenuRef = useRef<HTMLDetailsElement>(null);
  const basicShapeMenuRef = useRef<HTMLDetailsElement>(null);
  const editMenuRef = useRef<HTMLDetailsElement>(null);
  const moreMenuRef = useRef<HTMLDetailsElement>(null);
  const [backgroundDialogOpen, setBackgroundDialogOpen] = useState(false);
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);

  // Stäng öppna menyer när klicket sker utanför dem, men låt menyinnehållet vara interaktivt.
  useEffect(() => {
    const closeMenusOnOutsideClick = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      [moreMenuRef.current, shapeMenuRef.current, basicShapeMenuRef.current, editMenuRef.current].forEach((menu) => {
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
    if (basicShapeMenuRef.current) basicShapeMenuRef.current.open = false;
    if (shapeMenuRef.current) shapeMenuRef.current.open = false;
  };

  const handleMoreMenuAction = (action: () => void) => {
    if (moreMenuRef.current) moreMenuRef.current.open = false;
    action();
  };

  const handleEditMenuAction = (action: () => void) => {
    if (editMenuRef.current) editMenuRef.current.open = false;
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
          <details ref={editMenuRef} className="toolbar-shapes-menu toolbar-edit-menu">
            <summary className={`toolbar-tool toolbar-shapes-trigger${tool === 'select' ? ' is-active' : ''}`}>
              <span className="toolbar-tool-icon" aria-hidden="true">✂️</span>
              <span>{t.editing}</span>
            </summary>
            <div className="toolbar-shapes-panel toolbar-edit-panel" role="group" aria-label={t.editing}>
              <button
                type="button"
                className={`toolbar-tool${tool === 'select' ? ' is-active' : ''}`}
                onClick={() => handleEditMenuAction(() => setTool('select'))}
                aria-pressed={tool === 'select'}
              >
                <span className="toolbar-tool-icon" aria-hidden="true">👆</span>
                <span>{t.toolLabels.select}</span>
              </button>
              <button
                type="button"
                className="toolbar-tool"
                onClick={() => handleEditMenuAction(onUndo)}
                disabled={!canUndo}
                aria-keyshortcuts="Control+Z Meta+Z"
              >
                <span className="toolbar-tool-icon" aria-hidden="true">↶</span>
                <span>{t.undo}</span>
              </button>
              <button
                type="button"
                className="toolbar-tool"
                onClick={() => handleEditMenuAction(onRedo)}
                disabled={!canRedo}
                aria-keyshortcuts="Control+Y Control+Shift+Z Meta+Y Meta+Shift+Z"
              >
                <span className="toolbar-tool-icon" aria-hidden="true">↷</span>
                <span>{t.redo}</span>
              </button>
              {hasSelection && (
                <button
                  type="button"
                  className="toolbar-tool"
                  onClick={() => handleEditMenuAction(onDuplicateSelected)}
                  aria-keyshortcuts="Control+D Meta+D"
                >
                  <span className="toolbar-tool-icon" aria-hidden="true">📋</span>
                  <span>{t.copySelected}</span>
                </button>
              )}
            </div>
          </details>
          <details ref={basicShapeMenuRef} className="toolbar-shapes-menu">
            <summary className={`toolbar-tool toolbar-shapes-trigger${basicShapeTools.some(({ tool: shapeTool }) => shapeTool === tool) ? ' is-active' : ''}`}>
              <span className="toolbar-tool-icon" aria-hidden="true">🔷</span>
              <span>{t.basicShapes}</span>
            </summary>
            <div className="toolbar-shapes-panel" role="group" aria-label={t.additionalBasicShapes}>
              {basicShapeTools.map(({ tool: shapeTool, icon }) => (
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

          <label className="toolbar-background-toggle">
            <input
              type="checkbox"
              checked={gridEnabled}
              onChange={(event) => onGridEnabledChange(event.target.checked)}
            />
            <span>{t.gridEnabled}</span>
          </label>

          <label className="toolbar-setting">
            {t.gridSpacing}: {gridSize} px
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={gridSize}
              disabled={!gridEnabled}
              onChange={(event) => onGridSizeChange(Number(event.target.value))}
            />
          </label>

          <button
            type="button"
            className="toolbar-background-open"
            onClick={() => handleMoreMenuAction(() => setBackgroundDialogOpen(true))}
          >
            <span
              className={`toolbar-background-preview${backgroundTransparent ? ' is-transparent' : ''}`}
              style={backgroundTransparent ? undefined : { backgroundColor: hexToRgbaPreview(backgroundColor, backgroundOpacity) }}
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
          backgroundOpacity={backgroundOpacity}
          onConfirm={(nextColor, nextTransparent, nextOpacity) => {
            onBackgroundColorChange(nextColor);
            onBackgroundTransparentChange(nextTransparent);
            onBackgroundOpacityChange(nextOpacity);
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
