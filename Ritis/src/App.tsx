// Samlar ritprogrammets tillstånd och kopplar ihop verktygsfält, canvas och egenskapspanel.
// Hanterar filåtgärder och synkroniserar ritningens namn med webbläsarfliken.
import { useCallback, useEffect, useRef, useState } from 'react';
import type { DrawingFileFormat, Layer, Shape, ShapeColorPartKey, TextFontFamily, Tool } from './types';
import { isLanguage, translations, type Language } from './i18n';
import { Toolbar } from './components/Toolbar';
import { RestartConfirmationDialog } from './components/RestartConfirmationDialog';
import { SaveFormatDialog } from './components/SaveFormatDialog';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { usePointerEvents } from './hooks/usePointerEvents';
import {
  saveDrawingAsFormat,
  saveDrawingWithFilePicker,
  loadDrawingFromFile,
} from './utils/storage';

function hexToRgba(hex: string, opacity: number): string {
  const normalized = hex.replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return hex;
  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

function offsetShape(shape: Shape, offset: number): Shape {
  if (shape.type === 'line') {
    return {
      ...shape,
      x1: shape.x1 + offset,
      y1: shape.y1 + offset,
      x2: shape.x2 + offset,
      y2: shape.y2 + offset,
    };
  }
  if (shape.type === 'circle') {
    return { ...shape, cx: shape.cx + offset, cy: shape.cy + offset };
  }
  return { ...shape, x: shape.x + offset, y: shape.y + offset };
}

export default function App() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [tool, setTool] = useState<Tool>('freehand');
  const [color, setColor] = useState('#3b82f6');
  const [penWidth, setPenWidth] = useState(10);
  const [shapeOpacity, setShapeOpacity] = useState(1);
  const [gridEnabled, setGridEnabled] = useState(() => window.localStorage.getItem('ritis-grid-enabled') === 'true');
  const [gridSize, setGridSize] = useState(() => {
    const savedSize = Number(window.localStorage.getItem('ritis-grid-size'));
    return Number.isFinite(savedSize) && savedSize >= 1 && savedSize <= 40 ? savedSize : 20;
  });
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [backgroundTransparent, setBackgroundTransparent] = useState(false);
  const [backgroundOpacity, setBackgroundOpacity] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [restartDialogOpen, setRestartDialogOpen] = useState(false);
  const [saveFormatDialogOpen, setSaveFormatDialogOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [activeLayer, setActiveLayer] = useState<Layer>(1);
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = window.localStorage.getItem('ritis-language');
    return isLanguage(savedLanguage) ? savedLanguage : 'sv';
  });
  const historyRef = useRef<{
    past: Shape[][];
    future: Shape[][];
    previous: Shape[];
    pending: Shape[] | null;
    timer: number | null;
    skipNext: boolean;
  }>({
    past: [],
    future: [],
    previous: shapes,
    pending: null,
    timer: null,
    skipNext: false,
  });
  const canvasRef = useRef<SVGSVGElement>(null);
  const t = translations[language];

  useEffect(() => {
    const history = historyRef.current;
    if (history.skipNext) {
      history.skipNext = false;
      history.previous = shapes;
      return;
    }
    if (history.previous === shapes) return;

    if (JSON.stringify(history.previous) === JSON.stringify(shapes)) {
      history.previous = shapes;
      return;
    }

    if (history.pending === null) history.pending = history.previous;
    history.future = [];
    setCanUndo(true);
    setCanRedo(false);
    history.previous = shapes;
    if (history.timer !== null) window.clearTimeout(history.timer);
    history.timer = window.setTimeout(() => {
      if (history.pending !== null) history.past.push(history.pending);
      history.pending = null;
      history.timer = null;
      setCanUndo(history.past.length > 0);
    }, 500);
  }, [shapes]);

  useEffect(() => () => {
    const history = historyRef.current;
    if (history.timer !== null) window.clearTimeout(history.timer);
  }, []);

  // Sparar språkvalet och visar alltid appnamnet samt ritningens namn utan filändelse.
  useEffect(() => {
    window.localStorage.setItem('ritis-language', language);
    document.documentElement.lang = language;
    const drawingName = (fileName || t.newFileName).replace(/\.[^.]+$/, '');
    document.title = `${t.appTitle} - ${drawingName}`;
  }, [language, fileName, t.appTitle, t.newFileName]);

  useEffect(() => {
    window.localStorage.setItem('ritis-grid-enabled', String(gridEnabled));
  }, [gridEnabled]);

  useEffect(() => {
    window.localStorage.setItem('ritis-grid-size', String(gridSize));
  }, [gridSize]);

  const handleToolChange = (newTool: Tool) => {
    setTool(newTool);
    if (newTool !== 'select') {
      setSelectedId(null);
      setEditingTextId(null);
    }
  };

  const {
    draftShape,
    handleCanvasPointerDown,
    handleShapePointerDown,
    handleResizePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleCanvasPointerLeave,
  } = usePointerEvents({
    tool,
    setTool,
    color,
    penWidth,
    shapeOpacity,
    setEditingTextId,
    shapes,
    setShapes,
    selectedId,
    setSelectedId,
    activeLayer,
    setActiveLayer,
    gridEnabled,
    gridSize,
  });

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (selectedId) {
      setShapes((prev) => prev.map((shape) => (
        shape.id === selectedId && shape.type !== 'rainbow'
          ? { ...shape, color: newColor }
          : shape
      )));
    }
  };

  const handlePartColorChange = (key: ShapeColorPartKey, newColor: string) => {
    if (!selectedId) return;
    setShapes((prev) => prev.map((shape) => (
      shape.id === selectedId
        ? { ...shape, partColors: { ...shape.partColors, [key]: newColor } }
        : shape
    )));
  };

  const handlePenWidthChange = (width: number) => {
    setPenWidth(width);
    if (!selectedId) return;
    setShapes((prev) => prev.map((shape) => (
      shape.id === selectedId && (shape.type === 'freehand' || shape.type === 'line' || shape.type === 'spiderweb')
        ? { ...shape, strokeWidth: width }
        : shape
    )));
  };

  const handleShapeOpacityChange = (opacity: number) => {
    setShapeOpacity(opacity);
    if (selectedId) {
      setShapes((prev) => prev.map((shape) => (
        shape.id === selectedId ? { ...shape, opacity } : shape
      )));
    }
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setShapes((prev) => prev.filter((s) => s.id !== selectedId));
    setSelectedId(null);
    setEditingTextId(null);
  };

  const handleDuplicateSelected = useCallback(() => {
    const selectedShape = shapes.find((shape) => shape.id === selectedId);
    if (!selectedShape) return;
    const duplicate = { ...offsetShape(selectedShape, 20), id: crypto.randomUUID() };
    setShapes((prev) => [...prev, duplicate]);
    setSelectedId(duplicate.id);
  }, [selectedId, shapes]);

  const flushPendingHistory = useCallback(() => {
    const history = historyRef.current;
    if (history.timer !== null) window.clearTimeout(history.timer);
    history.timer = null;
    if (history.pending !== null) {
      history.past.push(history.pending);
      history.pending = null;
      history.future = [];
      setCanUndo(history.past.length > 0);
      setCanRedo(false);
    }
  }, []);

  const handleUndo = useCallback(() => {
    flushPendingHistory();
    const history = historyRef.current;
    const previous = history.past.pop();
    if (!previous) return;
    history.future.push(shapes);
    setCanUndo(history.past.length > 0);
    setCanRedo(true);
    history.skipNext = true;
    setShapes(previous);
  }, [flushPendingHistory, shapes]);

  const handleRedo = useCallback(() => {
    flushPendingHistory();
    const history = historyRef.current;
    const next = history.future.pop();
    if (!next) return;
    history.past.push(shapes);
    setCanUndo(true);
    setCanRedo(history.future.length > 0);
    history.skipNext = true;
    setShapes(next);
  }, [flushPendingHistory, shapes]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement
        && (target.isContentEditable || target.matches('input, textarea, select'))
      ) return;

      const modifier = event.ctrlKey || event.metaKey;
      if (!modifier) return;
      const key = event.key.toLowerCase();
      if (key === 'z') {
        event.preventDefault();
        if (event.shiftKey) handleRedo();
        else handleUndo();
      } else if (key === 'y') {
        event.preventDefault();
        handleRedo();
      } else if (key === 'd' && selectedId) {
        event.preventDefault();
        handleDuplicateSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDuplicateSelected, handleRedo, handleUndo, selectedId]);

  const handleConfirmRestart = () => {
    setShapes([]);
    setSelectedId(null);
    setEditingTextId(null);
    setRestartDialogOpen(false);
  };

  // En öppnad ritning uppdaterar former, bakgrund och filnamn tillsammans.
  const handleOpenFile = (file: File) => {
    loadDrawingFromFile(file, (loadedShapes, loadedBackgroundColor) => {
      setShapes(loadedShapes);
      setSelectedId(null);
      setEditingTextId(null);
      setBackgroundTransparent(loadedBackgroundColor === null);
      if (loadedBackgroundColor !== null) {
        const rgbaMatch = loadedBackgroundColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([.\d]+))?\)$/i);
        if (rgbaMatch) {
          const toHex = (value: number) => value.toString(16).padStart(2, '0');
          setBackgroundColor(`#${toHex(Number(rgbaMatch[1]))}${toHex(Number(rgbaMatch[2]))}${toHex(Number(rgbaMatch[3]))}`);
          setBackgroundOpacity(rgbaMatch[4] === undefined ? 1 : Number(rgbaMatch[4]));
          setBackgroundTransparent(Number(rgbaMatch[4] ?? 1) === 0);
        } else {
          setBackgroundColor(loadedBackgroundColor);
          setBackgroundOpacity(1);
        }
      }
      setFileName(file.name);
    }, language);
  };

  const handleBackgroundColorChange = (newColor: string) => {
    setBackgroundColor(newColor);
    setBackgroundTransparent(false);
  };

  const handleLayerChange = (layer: Layer) => {
    setActiveLayer(layer);
    if (selectedId) {
      setShapes((prev) => prev.map((shape) => (
        shape.id === selectedId ? { ...shape, layer } : shape
      )));
    }
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    if (!selectedId) return;
    setShapes((prev) => prev.map((shape) => {
      if (shape.id !== selectedId) return shape;
      if (shape.type === 'circle') {
        return axis === 'x' ? { ...shape, cx: value } : { ...shape, cy: value };
      }
      if (shape.type === 'line') {
        // Linjens andra ändpunkt flyttas lika mycket så att riktning och längd bevaras.
        return axis === 'x'
          ? { ...shape, x2: value + shape.x2 - shape.x1, x1: value }
          : { ...shape, y2: value + shape.y2 - shape.y1, y1: value };
      }
      return axis === 'x' ? { ...shape, x: value } : { ...shape, y: value };
    }));
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    if (!selectedId) return;
    setShapes((prev) => prev.map((shape) => {
      if (shape.id !== selectedId) return shape;

      if (shape.type === 'text') return shape;
      const safeValue = Math.max(shape.type === 'line' ? 0 : 10, value);
      if (shape.type === 'line') {
        return dimension === 'width'
          ? { ...shape, x2: shape.x1 + Math.sign(shape.x2 - shape.x1 || 1) * safeValue }
          : { ...shape, y2: shape.y1 + Math.sign(shape.y2 - shape.y1 || 1) * safeValue };
      }

      if (shape.type === 'circle') {
        // Cirklar sparas som ellipser när bredd och höjd ändras var för sig.
        const rx = shape.rx ?? shape.r;
        const ry = shape.ry ?? shape.r;
        const newRx = dimension === 'width' ? safeValue / 2 : rx;
        const newRy = dimension === 'height' ? safeValue / 2 : ry;
        return { ...shape, rx: newRx, ry: newRy, r: Math.max(newRx, newRy) };
      }

      return dimension === 'width'
        ? { ...shape, width: safeValue }
        : { ...shape, height: safeValue };
    }));
  };

  const handleRotationChange = (rotation: number) => {
    if (!selectedId) return;
    setShapes((prev) => prev.map((shape) => (
      shape.id === selectedId ? { ...shape, rotation } : shape
    )));
  };

  const handleTextChange = (id: string, text: string) => {
    if (selectedId !== id) return;
    setShapes((prev) => prev.map((shape) => (
      shape.id === id && shape.type === 'text' ? { ...shape, text } : shape
    )));
  };

  const handleTextSizeChange = (fontSize: number) => {
    if (!selectedId) return;
    setShapes((prev) => prev.map((shape) => (
      shape.id === selectedId && shape.type === 'text'
        ? { ...shape, fontSize: Math.max(8, fontSize) }
        : shape
    )));
  };

  const handleTextFontChange = (fontFamily: TextFontFamily) => {
    if (!selectedId) return;
    setShapes((prev) => prev.map((shape) => (
      shape.id === selectedId && shape.type === 'text'
        ? { ...shape, fontFamily }
        : shape
    )));
  };

  // Samlar sparning och export; webbläsarens filväljare avgör format när den finns.
  const handleSaveExport = async () => {
    if (!canvasRef.current) {
      window.alert(t.missingCanvasForExport);
      return;
    }

    try {
      const result = await saveDrawingWithFilePicker(
        shapes,
        canvasRef.current,
        fileName || t.newFileName,
        language,
        backgroundTransparent ? null : hexToRgba(backgroundColor, backgroundOpacity),
      );
      if (result.status === 'unsupported') setSaveFormatDialogOpen(true);
      else if (result.status === 'saved') setFileName(result.fileName);
    } catch (error) {
      console.error(t.saveFailed, error);
      window.alert(t.saveFailed);
    }
  };

  const handleSaveFormat = async (format: DrawingFileFormat, chosenFileName: string) => {
    setSaveFormatDialogOpen(false);
    if (!canvasRef.current) {
      window.alert(t.missingCanvasForExport);
      return;
    }

    const baseName = chosenFileName.trim().replace(/\.(json|jpe?g|png|svg)$/i, '') || t.newFileName;
    const extension = format === 'jpeg' ? 'jpg' : format;
    try {
      const saved = await saveDrawingAsFormat(
        format,
        shapes,
        canvasRef.current,
        baseName,
        language,
        backgroundTransparent ? null : hexToRgba(backgroundColor, backgroundOpacity),
      );
      if (saved) setFileName(`${baseName}.${extension}`);
    } catch (error) {
      const errorMessage = format === 'json' ? t.saveFailed : t.exportFailed;
      console.error(errorMessage, error);
      window.alert(errorMessage);
    }
  };

  // Förhandsgranskningen inkluderar den pågående formen; lager sorteras före ritning.
  const allShapes = (draftShape ? [...shapes, draftShape] : [...shapes])
    .sort((a, b) => a.layer - b.layer);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', margin: 0 }}>
      <Toolbar
        tool={tool}
        setTool={handleToolChange}
        hasSelection={Boolean(selectedId)}
        canUndo={canUndo}
        canRedo={canRedo}
        onDuplicateSelected={handleDuplicateSelected}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onRestartRequest={() => setRestartDialogOpen(true)}
        onSaveExport={handleSaveExport}
        onOpenFile={handleOpenFile}
        activeLayer={activeLayer}
        onLayerChange={handleLayerChange}
        language={language}
        onLanguageChange={setLanguage}
        backgroundColor={backgroundColor}
        backgroundTransparent={backgroundTransparent}
        backgroundOpacity={backgroundOpacity}
        onBackgroundColorChange={handleBackgroundColorChange}
        onBackgroundTransparentChange={setBackgroundTransparent}
        onBackgroundOpacityChange={setBackgroundOpacity}
        gridEnabled={gridEnabled}
        gridSize={gridSize}
        onGridEnabledChange={setGridEnabled}
        onGridSizeChange={setGridSize}
      />
      <div
        className={backgroundTransparent ? 'canvas-transparent-background' : undefined}
        style={{ display: 'flex', flex: 1, minHeight: 0 }}
      >
        <Canvas
          shapes={allShapes}
          selectedId={selectedId}
          editingTextId={editingTextId}
          setEditingTextId={setEditingTextId}
          tool={tool}
          language={language}
          backgroundColor={backgroundTransparent ? 'transparent' : hexToRgba(backgroundColor, backgroundOpacity)}
          svgRef={canvasRef}
          gridEnabled={gridEnabled}
          gridSize={gridSize}
          onTextChange={handleTextChange}
          onCanvasPointerDown={handleCanvasPointerDown}
          onShapePointerDown={handleShapePointerDown}
          onResizePointerDown={handleResizePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handleCanvasPointerLeave}
        />
        <PropertiesPanel
          language={language}
          tool={tool}
          penWidth={penWidth}
          penColor={color}
          onPenWidthChange={handlePenWidthChange}
          shapeOpacity={shapeOpacity}
          onShapeOpacityChange={handleShapeOpacityChange}
          selectedShape={shapes.find((shape) => shape.id === selectedId) ?? null}
          onPositionChange={handlePositionChange}
          onSizeChange={handleSizeChange}
          onRotationChange={handleRotationChange}
          onTextChange={(text) => {
            if (selectedId) handleTextChange(selectedId, text);
          }}
          onTextSizeChange={handleTextSizeChange}
          onTextFontChange={handleTextFontChange}
          onLayerChange={handleLayerChange}
          onColorChange={handleColorChange}
          onPartColorChange={handlePartColorChange}
          onDeleteSelected={deleteSelected}
        />
      </div>
      {restartDialogOpen && (
        <RestartConfirmationDialog
          language={language}
          onConfirm={handleConfirmRestart}
          onCancel={() => setRestartDialogOpen(false)}
        />
      )}
      {saveFormatDialogOpen && (
        <SaveFormatDialog
          language={language}
          fileName={fileName || t.newFileName}
          onSelect={handleSaveFormat}
          onCancel={() => setSaveFormatDialogOpen(false)}
        />
      )}
    </div>
  );
}
