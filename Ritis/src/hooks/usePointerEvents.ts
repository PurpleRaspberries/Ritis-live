// Hanterar ritning, markering, flytt och storleksändring via pekarhändelser.
// Används av App för att uppdatera former och omvandla koordinater till SVG-ytan.
import { useState } from 'react';
import type { Layer, ResizeHandle, Shape, Tool } from '../types';
import { getSvgCoords } from '../utils/geometry';

type BoundedShape = Extract<Shape, { x: number; y: number; width: number; height: number }>;

function isBoundedShape(shape: Shape): shape is BoundedShape {
  return 'width' in shape;
}

interface UsePointerProps {
  tool: Tool;
  setTool: (tool: Tool) => void;
  color: string;
  penWidth: number;
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
  penWidth,
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

  // Startar ny text direkt eller påbörjar ett ritobjekt som färdigställs när pekaren släpps.
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
        {
          id,
          type: 'text',
          x: pos.x,
          y: pos.y,
          text: '',
          fontSize: 32,
          fontFamily: 'Arial, sans-serif',
          color,
          layer: activeLayer,
        },
      ]);
      setSelectedId(id);
      setTool('select');
      setStartPos(null);
      return;
    }

    if (tool === 'freehand') {
      e.currentTarget.setPointerCapture(e.pointerId);
      setDraftShape({
        id,
        type: 'freehand',
        x: pos.x - 0.5,
        y: pos.y - 0.5,
        width: 1,
        height: 1,
        points: [{ x: 0.5, y: 0.5 }],
        strokeWidth: penWidth,
        color,
        layer: activeLayer,
      });
      setSelectedId(null);
      return;
    }

    setSelectedId(null);

    if (tool === 'rect') {
      setDraftShape({ id, type: 'rect', x: pos.x, y: pos.y, width: 0, height: 0, color, layer: activeLayer });
    } else if (tool === 'circle') {
      setDraftShape({ id, type: 'circle', cx: pos.x, cy: pos.y, r: 0, color, layer: activeLayer });
    } else if (tool === 'line') {
      setDraftShape({
        id,
        type: 'line',
        x1: pos.x,
        y1: pos.y,
        x2: pos.x,
        y2: pos.y,
        strokeWidth: penWidth,
        color,
        layer: activeLayer,
      });
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
    } else if (tool === 'sun') {
      setDraftShape({ id, type: 'sun', x: pos.x, y: pos.y, width: 0, height: 0, color, layer: activeLayer });
    } else if (tool === 'star') {
      setDraftShape({ id, type: 'star', x: pos.x, y: pos.y, width: 0, height: 0, color, layer: activeLayer });
    } else if (tool === 'gingerbread') {
      setDraftShape({ id, type: 'gingerbread', x: pos.x, y: pos.y, width: 0, height: 0, color, layer: activeLayer });
    } else if (tool === 'flower') {
      setDraftShape({ id, type: 'flower', x: pos.x, y: pos.y, width: 0, height: 0, color, layer: activeLayer });
    } else if (tool === 'leaf') {
      setDraftShape({ id, type: 'leaf', x: pos.x, y: pos.y, width: 0, height: 0, color, layer: activeLayer });
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
    e: React.PointerEvent<SVGElement>,
    id: string,
    handle: ResizeHandle,
  ) => {
    if (tool !== 'select') return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);

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
          if (isBoundedShape(shape)) {
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

          if (isBoundedShape(shape)) {
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

          if (shape.type === 'line') {
            if (resizeHandle === 'line-start') return { ...shape, x1: pos.x, y1: pos.y };
            if (resizeHandle === 'line-end') return { ...shape, x2: pos.x, y2: pos.y };
            return shape;
          }
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

    // Uppdaterar förhandsvisningen medan ett nytt objekt ritas.
    if (!draftShape) return;
    if (draftShape.type === 'freehand') {
      // Frihandspunkterna normaliseras mot objektets ruta så att strecket kan flyttas och storleksändras.
      const points = draftShape.points.map((point) => ({
        x: draftShape.x + point.x * draftShape.width,
        y: draftShape.y + point.y * draftShape.height,
      }));
      const lastPoint = points[points.length - 1];
      if (lastPoint && Math.hypot(pos.x - lastPoint.x, pos.y - lastPoint.y) < 1) return;

      points.push(pos);
      const minX = Math.min(...points.map((point) => point.x));
      const minY = Math.min(...points.map((point) => point.y));
      const width = Math.max(...points.map((point) => point.x)) - minX;
      const height = Math.max(...points.map((point) => point.y)) - minY;
      const normalizedWidth = Math.max(width, 1);
      const normalizedHeight = Math.max(height, 1);

      setDraftShape({
        ...draftShape,
        x: minX,
        y: minY,
        width: normalizedWidth,
        height: normalizedHeight,
        points: points.map((point) => ({
          x: (point.x - minX) / normalizedWidth,
          y: (point.y - minY) / normalizedHeight,
        })),
      });
    } else if (draftShape.type === 'line') {
      setDraftShape({ ...draftShape, x2: pos.x, y2: pos.y });
    } else if (isBoundedShape(draftShape)) {
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
    // Lägg till hela det sammanhängande draget som ett objekt i ritningens tillstånd.
    if (draftShape) {
      setShapes((prev) => [...prev, draftShape]);
      setDraftShape(null);
    }
    setStartPos(null);
    setIsDragging(false);
    setResizeHandle(null);
  };

  const handleCanvasPointerLeave = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draftShape?.type === 'freehand' && e.buttons === 0) {
      handlePointerUp();
    }
  };

  return {
    draftShape,
    handleCanvasPointerDown,
    handleShapePointerDown,
    handleResizePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleCanvasPointerLeave,
  };
}
