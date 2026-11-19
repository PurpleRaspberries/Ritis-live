// Samlar ritprogrammets tillstånd och kopplar ihop verktygsfält, canvas och egenskapspanel.
// Hanterar även filåtgärder och skickar händelser vidare till komponenter och hjälpfunktioner.
import { useRef, useState } from 'react';
import type { Layer, Shape, Tool } from './types';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { usePointerEvents } from './hooks/usePointerEvents';
import { saveDrawingToFile, loadDrawingFromFile, exportDrawingToJpeg } from './utils/storage';

export default function App() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [tool, setTool] = useState<Tool>('rect');
  const [color, setColor] = useState('#3b82f6');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fileName, setFileName] = useState('min-ritning');
  const [activeLayer, setActiveLayer] = useState<Layer>(1);
  const canvasRef = useRef<SVGSVGElement>(null);

  const handleToolChange = (newTool: Tool) => {
    setTool(newTool);
    if (newTool !== 'select') {
      setSelectedId(null);
    }
  };

  const {
    draftShape,
    handleCanvasPointerDown,
    handleShapePointerDown,
    handleResizePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = usePointerEvents({
    tool,
    setTool,
    color,
    shapes,
    setShapes,
    selectedId,
    setSelectedId,
    activeLayer,
    setActiveLayer,
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

  const deleteSelected = () => {
    if (!selectedId) return;
    setShapes((prev) => prev.filter((s) => s.id !== selectedId));
    setSelectedId(null);
  };

  const handleOpenFile = (file: File) => {
    loadDrawingFromFile(file, (loadedShapes) => {
      setShapes(loadedShapes);
      setSelectedId(null);
      setFileName(file.name.replace(/\.json$/i, '') || 'min-ritning');
    });
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

  const handleExportJpeg = async () => {
    if (!canvasRef.current) {
      window.alert('Kunde inte hitta ritytan för export.');
      return;
    }

    try {
      await exportDrawingToJpeg(canvasRef.current, fileName);
    } catch (error) {
      console.error('JPEG-exporten misslyckades:', error);
      window.alert(error instanceof Error ? error.message : 'JPEG-exporten misslyckades.');
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
        color={color}
        onColorChange={handleColorChange}
        hasSelection={Boolean(selectedId)}
        onDeleteSelected={deleteSelected}
        onClearAll={() => { setShapes([]); setSelectedId(null); }}
        onSave={() => saveDrawingToFile(shapes, fileName)}
        onExportJpeg={handleExportJpeg}
        onOpenFile={handleOpenFile}
        fileName={fileName}
        onFileNameChange={setFileName}
        activeLayer={activeLayer}
        onLayerChange={handleLayerChange}
      />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Canvas
          shapes={allShapes}
          selectedId={selectedId}
          tool={tool}
          svgRef={canvasRef}
          onTextChange={handleTextChange}
          onCanvasPointerDown={handleCanvasPointerDown}
          onShapePointerDown={handleShapePointerDown}
          onResizePointerDown={handleResizePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
        <PropertiesPanel
          selectedShape={shapes.find((shape) => shape.id === selectedId) ?? null}
          onPositionChange={handlePositionChange}
          onSizeChange={handleSizeChange}
          onTextChange={(text) => {
            if (selectedId) handleTextChange(selectedId, text);
          }}
          onTextSizeChange={handleTextSizeChange}
          onLayerChange={handleLayerChange}
          onColorChange={handleColorChange}
        />
      </div>
    </div>
  );
}
