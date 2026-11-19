// Hanterar ritning, markering, flytt och storleksändring via pekarhändelser.
// Används av App för att uppdatera former och omvandla koordinater till SVG-ytan.
import { useState } from 'react';
import type { Layer, ResizeHandle, Shape, Tool } from '../types';
import { getSvgCoords } from '../utils/geometry';

interface UsePointerProps {
  tool: Tool;
  setTool: (tool: Tool) => void;
  color: string;
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  activeLayer: Layer;
  setActiveLayer: (layer: Layer) => void;
}

export function usePointerEvents({
  tool,
  setTool,
  color,
  shapes,
  setShapes,
  selectedId,
  setSelectedId,
  activeLayer,
  setActiveLayer,
}: UsePointerProps) {
  const [draftShape, setDraftShape] = useState<Shape | null>(null);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);

  const handleCanvasPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const pos = getSvgCoords(e);
    setStartPos(pos);

    if (tool === 'select') {
      setSelectedId(null);
      return;
    }

    const id = crypto.randomUUID();

    if (tool === 'text') {
      setShapes((prev) => [
        ...prev,
        { id, type: 'text', x: pos.x, y: pos.y, text: 'Text', fontSize: 32, color, layer: activeLayer },
      ]);
      setSelectedId(id);
      setTool('select');
      setStartPos(null);
      return;
    }

    setSelectedId(null);

    if (tool === 'rect') {
      setDraftShape({ id, type: 'rect', x: pos.x, y: pos.y, width: 0, height: 0, color, layer: activeLayer });
    } else if (tool === 'circle') {
      setDraftShape({ id, type: 'circle', cx: pos.x, cy: pos.y, r: 0, color, layer: activeLayer });
    } else if (tool === 'line') {
      setDraftShape({ id, type: 'line', x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y, color, layer: activeLayer });
    } else if (tool === 'heart') {
      setDraftShape({ id, type: 'heart', x: pos.x, y: pos.y, width: 0, height: 0, color, layer: activeLayer });
    } else if (tool === 'rabbit') {
      setDraftShape({ id, type: 'rabbit', x: pos.x, y: pos.y, width: 0, height: 0, color, layer: activeLayer });
    } else if (tool === 'rainbow') {
      setDraftShape({ id, type: 'rainbow', x: pos.x, y: pos.y, width: 0, height: 0, layer: activeLayer });
    } else if (tool === 'cloud') {
      setDraftShape({ id, type: 'cloud', x: pos.x, y: pos.y, width: 0, height: 0, color, layer: activeLayer });
    } else if (tool === 'unicorn') {
      setDraftShape({ id, type: 'unicorn', x: pos.x, y: pos.y, width: 0, height: 0, color, layer: activeLayer });
    }
  };

  const handleShapePointerDown = (e: React.PointerEvent<SVGElement>, id: string) => {
    if (tool !== 'select') return;
    e.stopPropagation();

    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();

    setSelectedId(id);
    const selectedShape = shapes.find((shape) => shape.id === id);
    if (selectedShape?.layer) setActiveLayer(selectedShape.layer);
    setIsDragging(true);
    setStartPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleResizePointerDown = (
    e: React.PointerEvent<SVGRectElement>,
    id: string,
    handle: ResizeHandle,
  ) => {
    if (tool !== 'select') return;
    e.stopPropagation();

    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();

    setSelectedId(id);
    setResizeHandle(handle);
    setIsDragging(false);
    setStartPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!startPos) return;
    const pos = getSvgCoords(e);

    if (tool === 'select' && isDragging && selectedId) {
      const dx = pos.x - startPos.x;
      const dy = pos.y - startPos.y;

      // Samma förflyttning tillämpas på alla punkter i linjer, inte bara på deras första punkt.
      setShapes((prev) =>
        prev.map((shape) => {
          if (shape.id !== selectedId) return shape;
          if (shape.type === 'line') {
            return {
              ...shape,
              x1: shape.x1 + dx,
              y1: shape.y1 + dy,
              x2: shape.x2 + dx,
              y2: shape.y2 + dy,
            };
          }
          if (shape.type === 'text') {
            return { ...shape, x: shape.x + dx, y: shape.y + dy };
          }
          if (shape.type === 'rect' || shape.type === 'heart' || shape.type === 'rabbit' || shape.type === 'rainbow' || shape.type === 'cloud' || shape.type === 'unicorn') {
            return { ...shape, x: shape.x + dx, y: shape.y + dy };
          }
          return { ...shape, cx: shape.cx + dx, cy: shape.cy + dy };
        })
      );
      setStartPos(pos);
      return;
    }

    if (tool === 'select' && resizeHandle && selectedId) {
      // Begränsningarna hindrar att handtagen vänder formen eller gör den osynligt liten.
      setShapes((prev) =>
        prev.map((shape) => {
          if (shape.id !== selectedId) return shape;

          if (shape.type === 'rect' || shape.type === 'heart' || shape.type === 'rabbit' || shape.type === 'rainbow' || shape.type === 'cloud' || shape.type === 'unicorn') {
            let left = shape.x;
            let top = shape.y;
            let right = shape.x + shape.width;
            let bottom = shape.y + shape.height;

            if (resizeHandle.includes('w')) left = Math.min(pos.x, right - 20);
            if (resizeHandle.includes('e')) right = Math.max(pos.x, left + 20);
            if (resizeHandle.includes('n')) top = Math.min(pos.y, bottom - 20);
            if (resizeHandle.includes('s')) bottom = Math.max(pos.y, top + 20);

            return { ...shape, x: left, y: top, width: right - left, height: bottom - top };
          }

          if (shape.type === 'line') return shape;
          if (shape.type === 'text') return shape;

          const rx = shape.rx ?? shape.r;
          const ry = shape.ry ?? shape.r;
          let left = shape.cx - rx;
          let top = shape.cy - ry;
          let right = shape.cx + rx;
          let bottom = shape.cy + ry;

          if (resizeHandle === 'w') left = Math.min(pos.x, right - 10);
          if (resizeHandle === 'e') right = Math.max(pos.x, left + 10);
          if (resizeHandle === 'n') top = Math.min(pos.y, bottom - 10);
          if (resizeHandle === 's') bottom = Math.max(pos.y, top + 10);

          if (resizeHandle.includes('w')) left = Math.min(pos.x, right - 10);
          if (resizeHandle.includes('e')) right = Math.max(pos.x, left + 10);
          if (resizeHandle.includes('n')) top = Math.min(pos.y, bottom - 10);
          if (resizeHandle.includes('s')) bottom = Math.max(pos.y, top + 10);

          const newRx = (right - left) / 2;
          const newRy = (bottom - top) / 2;
          return {
            ...shape,
            cx: left + newRx,
            cy: top + newRy,
            rx: newRx,
            ry: newRy,
            r: Math.max(newRx, newRy),
          };
        }),
      );
      setStartPos(pos);
      return;
    }

    if (!draftShape) return;
    if (draftShape.type === 'line') {
      setDraftShape({ ...draftShape, x2: pos.x, y2: pos.y });
    } else if (draftShape.type === 'rect' || draftShape.type === 'heart' || draftShape.type === 'rabbit' || draftShape.type === 'rainbow' || draftShape.type === 'cloud' || draftShape.type === 'unicorn') {
      setDraftShape({
        ...draftShape,
        x: Math.min(startPos.x, pos.x),
        y: Math.min(startPos.y, pos.y),
        width: Math.abs(pos.x - startPos.x),
        height: Math.abs(pos.y - startPos.y),
      });
    } else if (draftShape.type === 'circle') {
      // Cirkeln börjar med lika radier och kan därefter göras elliptisk med storlekshandtagen.
      const r = Math.hypot(pos.x - startPos.x, pos.y - startPos.y);
      setDraftShape({ ...draftShape, r, rx: r, ry: r });
    }
  };

  const handlePointerUp = () => {
    if (draftShape) {
      setShapes([...shapes, draftShape]);
      setDraftShape(null);
    }
    setStartPos(null);
    setIsDragging(false);
    setResizeHandle(null);
  };

  return {
    draftShape,
    handleCanvasPointerDown,
    handleShapePointerDown,
    handleResizePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
