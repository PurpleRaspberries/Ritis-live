// Ritar canvasens bakgrund, former och redigeringshandtag i SVG.
// Tar emot data och pekarhändelser från App och skickar textändringar tillbaka.
import React from 'react';
import type { ResizeHandle, Shape, ShapeColorPartKey, Tool } from '../types';
import { translations, type Language } from '../i18n';
import { getShapeColorParts, rainbowColorPartKeys, rainbowDefaultColors } from '../utils/shapeColors';
import { getShapeRotationCenter } from '../utils/geometry';

interface CanvasProps {
  shapes: Shape[];
  selectedId: string | null;
  editingTextId: string | null;
  setEditingTextId: (id: string | null) => void;
  tool: Tool;
  language: Language;
  backgroundColor: string;
  gridEnabled: boolean;
  gridSize: number;
  svgRef: React.Ref<SVGSVGElement>;
  onTextChange: (id: string, text: string) => void;
  onCanvasPointerDown: (e: React.PointerEvent<SVGSVGElement>) => void;
  onShapePointerDown: (e: React.PointerEvent<SVGElement>, id: string) => void;
  onResizePointerDown: (e: React.PointerEvent<SVGElement>, id: string, handle: ResizeHandle) => void;
  onPointerMove: (e: React.PointerEvent<SVGSVGElement>) => void;
  onPointerUp: () => void;
  onPointerLeave: (e: React.PointerEvent<SVGSVGElement>) => void;
}

function createHeartPath(x: number, y: number, w: number, h: number): string {
  const topCurveHeight = h * 0.3;
  return [
    `M ${x + w / 2} ${y + topCurveHeight}`,
    `C ${x + w / 2} ${y}, ${x} ${y}, ${x} ${y + topCurveHeight}`,
    `C ${x} ${y + (h + topCurveHeight) / 2}, ${x + w / 2} ${y + (h + topCurveHeight) / 1.35}, ${x + w / 2} ${y + h}`,
    `C ${x + w / 2} ${y + (h + topCurveHeight) / 1.35}, ${x + w} ${y + (h + topCurveHeight) / 2}, ${x + w} ${y + topCurveHeight}`,
    `C ${x + w} ${y}, ${x + w / 2} ${y}, ${x + w / 2} ${y + topCurveHeight}`,
    'Z',
  ].join(' ');
}

function createRabbitPath(x: number, y: number, w: number, h: number): string {
  const sx = w / 100;
  const sy = h / 100;
  const p = (px: number, py: number) => `${x + px * sx} ${y + py * sy}`;
  return [
    `M ${p(27, 73)}`,
    `C ${p(14, 62)}, ${p(18, 43)}, ${p(34, 38)}`,
    `C ${p(38, 26)}, ${p(34, 5)}, ${p(43, 3)}`,
    `C ${p(51, 2)}, ${p(49, 25)}, ${p(48, 37)}`,
    `C ${p(52, 26)}, ${p(57, 5)}, ${p(66, 4)}`,
    `C ${p(74, 4)}, ${p(65, 29)}, ${p(62, 39)}`,
    `C ${p(78, 43)}, ${p(84, 58)}, ${p(75, 72)}`,
    `C ${p(82, 82)}, ${p(68, 91)}, ${p(58, 82)}`,
    `C ${p(47, 91)}, ${p(31, 88)}, ${p(27, 73)} Z`,
  ].join(' ');
}

function createCloudPath(x: number, y: number, w: number, h: number): string {
  const sx = w / 100;
  const sy = h / 100;
  const p = (px: number, py: number) => `${x + px * sx} ${y + py * sy}`;
  return [
    `M ${p(24, 74)}`,
    `C ${p(11, 74)}, ${p(5, 65)}, ${p(5, 54)}`,
    `C ${p(5, 43)}, ${p(13, 35)}, ${p(25, 35)}`,
    `C ${p(24, 20)}, ${p(39, 11)}, ${p(53, 16)}`,
    `C ${p(61, 2)}, ${p(82, 7)}, ${p(84, 25)}`,
    `C ${p(97, 26)}, ${p(100, 38)}, ${p(97, 48)}`,
    `C ${p(100, 58)}, ${p(98, 74)}, ${p(84, 74)}`,
    `Z`,
  ].join(' ');
}

function createStarPath(x: number, y: number, width: number, height: number): string {
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const points = Array.from({ length: 10 }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI / 5;
    const radius = index % 2 === 0 ? 0.5 : 0.23;
    const pointX = centerX + Math.cos(angle) * width * radius;
    const pointY = centerY + Math.sin(angle) * height * radius;
    return `${index === 0 ? 'M' : 'L'} ${pointX} ${pointY}`;
  });
  return `${points.join(' ')} Z`;
}

function createGingerbreadPath(x: number, y: number, width: number, height: number): string {
  const sx = width / 100;
  const sy = height / 100;
  const p = (px: number, py: number) => `${x + px * sx} ${y + py * sy}`;
  return [
    `M ${p(50, 4)}`,
    `C ${p(37, 4)}, ${p(28, 14)}, ${p(28, 27)}`,
    `C ${p(28, 34)}, ${p(32, 40)}, ${p(38, 44)}`,
    `L ${p(27, 47)}`,
    `C ${p(19, 49)}, ${p(13, 55)}, ${p(12, 62)}`,
    `C ${p(11, 68)}, ${p(16, 72)}, ${p(21, 69)}`,
    `L ${p(31, 60)} L ${p(34, 75)} L ${p(25, 89)}`,
    `C ${p(21, 95)}, ${p(30, 101)}, ${p(35, 95)}`,
    `L ${p(49, 78)} L ${p(51, 78)} L ${p(65, 95)}`,
    `C ${p(70, 101)}, ${p(79, 95)}, ${p(75, 89)}`,
    `L ${p(66, 75)} L ${p(69, 60)} L ${p(79, 69)}`,
    `C ${p(84, 72)}, ${p(89, 68)}, ${p(88, 62)}`,
    `C ${p(87, 55)}, ${p(81, 49)}, ${p(73, 47)}`,
    `L ${p(62, 44)}`,
    `C ${p(68, 40)}, ${p(72, 34)}, ${p(72, 27)}`,
    `C ${p(72, 14)}, ${p(63, 4)}, ${p(50, 4)} Z`,
  ].join(' ');
}

function createLeafPath(x: number, y: number, width: number, height: number): string {
  const sx = width / 100;
  const sy = height / 100;
  const p = (px: number, py: number) => `${x + px * sx} ${y + py * sy}`;
  return [
    `M ${p(50, 2)}`,
    `C ${p(7, 23)}, ${p(10, 76)}, ${p(50, 98)}`,
    `C ${p(90, 76)}, ${p(93, 23)}, ${p(50, 2)} Z`,
  ].join(' ');
}

function createFreehandPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return '';
  if (points.length === 1) {
    const point = points[0];
    return `M ${point.x} ${point.y} l 0.001 0`;
  }

  // Kvadratiska Bézierkurvor till mittpunkter jämnar ut hörn utan att tappa ritpunkter.
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    if (index < points.length - 1) {
      const nextPoint = points[index + 1];
      const middleX = (point.x + nextPoint.x) / 2;
      const middleY = (point.y + nextPoint.y) / 2;
      path += ` Q ${point.x} ${point.y} ${middleX} ${middleY}`;
    } else {
      path += ` L ${point.x} ${point.y}`;
    }
  }
  return path;
}

function createSpiderwebSpokes(x: number, y: number, width: number, height: number) {
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const radiusX = width / 2;
  const radiusY = height / 2;

  return Array.from({ length: 12 }, (_, index) => {
    const angle = (index * Math.PI) / 6;
    return {
      x1: centerX,
      y1: centerY,
      x2: centerX + Math.cos(angle) * radiusX,
      y2: centerY + Math.sin(angle) * radiusY,
    };
  });
}

function createUnicornPaths(
  x: number,
  y: number,
  w: number,
  h: number,
  bodyColor: string,
): Array<{
  fill: string;
  path: string;
  stroke?: string;
  strokeWidth?: number;
  fillPart?: ShapeColorPartKey;
  strokePart?: ShapeColorPartKey;
}> {
  const sx = w / 100;
  const sy = h / 100;
  const p = (px: number, py: number) => `${x + px * sx} ${y + py * sy}`;

  return [
    {
      fill: '#ec4899',
      fillPart: 'unicorn-pink',
      path: [
        `M ${p(19, 57)}`,
        `C ${p(9, 49)}, ${p(5, 58)}, ${p(14, 64)}`,
        `C ${p(5, 70)}, ${p(12, 78)}, ${p(21, 70)}`,
        `C ${p(24, 66)}, ${p(24, 61)}, ${p(19, 57)} Z`,
      ].join(' '),
    },
    {
      fill: bodyColor,
      fillPart: 'unicorn-body',
      path: [
        `M ${p(17, 69)}`,
        `C ${p(15, 58)}, ${p(24, 52)}, ${p(38, 51)}`,
        `C ${p(43, 39)}, ${p(51, 30)}, ${p(64, 31)}`,
        `C ${p(72, 31)}, ${p(78, 35)}, ${p(81, 41)}`,
        `L ${p(95, 45)}`,
        `C ${p(101, 47)}, ${p(99, 53)}, ${p(93, 55)}`,
        `L ${p(81, 56)}`,
        `C ${p(79, 64)}, ${p(73, 69)}, ${p(64, 71)}`,
        `L ${p(63, 88)} L ${p(55, 88)} L ${p(54, 71)}`,
        `L ${p(37, 71)} L ${p(34, 88)} L ${p(26, 88)} L ${p(24, 70)}`,
        `C ${p(21, 70)}, ${p(19, 70)}, ${p(17, 69)} Z`,
      ].join(' '),
    },
    {
      fill: '#a855f7',
      fillPart: 'unicorn-mane',
      path: [
        `M ${p(55, 34)}`,
        `C ${p(47, 29)}, ${p(41, 36)}, ${p(46, 44)}`,
        `C ${p(38, 50)}, ${p(42, 58)}, ${p(50, 59)}`,
        `C ${p(43, 67)}, ${p(47, 75)}, ${p(56, 76)}`,
        `C ${p(53, 67)}, ${p(61, 61)}, ${p(65, 54)}`,
        `C ${p(70, 45)}, ${p(65, 36)}, ${p(55, 34)} Z`,
      ].join(' '),
    },
    {
      fill: '#facc15',
      fillPart: 'unicorn-horn',
      path: `M ${p(71, 34)} L ${p(77, 5)} L ${p(83, 38)} Z`,
    },
    {
      fill: '#fbcfe8',
      fillPart: 'unicorn-ear',
      path: `M ${p(60, 33)} L ${p(62, 17)} L ${p(72, 32)} Z`,
    },
    {
      fill: '#f9a8d4',
      fillPart: 'unicorn-ear-detail',
      path: `M ${p(63, 30)} L ${p(63, 21)} L ${p(69, 31)} Z`,
    },
    {
      fill: '#ec4899',
      fillPart: 'unicorn-pink',
      path: [
        `M ${p(51, 37)}`,
        `C ${p(46, 35)}, ${p(45, 40)}, ${p(50, 44)}`,
        `C ${p(54, 46)}, ${p(58, 48)}, ${p(60, 52)}`,
        `C ${p(60, 46)}, ${p(57, 41)}, ${p(51, 37)} Z`,
      ].join(' '),
    },
    {
      fill: '#22d3ee',
      fillPart: 'unicorn-mane-highlight',
      path: [
        `M ${p(47, 51)}`,
        `C ${p(43, 48)}, ${p(42, 54)}, ${p(48, 58)}`,
        `C ${p(52, 60)}, ${p(55, 62)}, ${p(56, 67)}`,
        `C ${p(60, 61)}, ${p(55, 55)}, ${p(47, 51)} Z`,
      ].join(' '),
    },
    {
      fill: '#fbcfe8',
      fillPart: 'unicorn-muzzle',
      path: [
        `M ${p(88, 48)}`,
        `C ${p(94, 47)}, ${p(97, 50)}, ${p(94, 53)}`,
        `C ${p(92, 55)}, ${p(87, 54)}, ${p(85, 52)} Z`,
      ].join(' '),
    },
    {
      fill: 'none',
      stroke: '#7c2d12',
      strokePart: 'unicorn-brown-details',
      strokeWidth: 2,
      path: `M ${p(88, 56)} C ${p(91, 59)}, ${p(95, 57)}, ${p(96, 55)}`,
    },
    {
      fill: 'none',
      stroke: '#ffffff',
      strokePart: 'unicorn-white-details',
      strokeWidth: 2,
      path: `M ${p(74, 25)} L ${p(77, 29)} L ${p(79, 24)}`,
    },
    {
      fill: 'none',
      stroke: '#7c2d12',
      strokePart: 'unicorn-brown-details',
      strokeWidth: 2,
      path: `M ${p(26, 83)} L ${p(34, 83)} M ${p(55, 83)} L ${p(63, 83)}`,
    },
    {
      fill: '#facc15',
      fillPart: 'unicorn-star',
      path: `M ${p(42, 56)} L ${p(43, 59)} L ${p(46, 59)} L ${p(44, 61)} L ${p(45, 64)} L ${p(42, 62)} L ${p(40, 64)} L ${p(41, 61)} L ${p(39, 59)} L ${p(42, 59)} Z`,
    },
  ];
}

// Varje färgband är ett halvt ringsegment, där nästa radie blir mindre åt samma centrum.
function createRainbowBands(x: number, y: number, width: number, height: number) {
  const bandSize = Math.max(0.1, Math.min(width / 16, height / 8));
  const centerX = x + width / 2;
  const baseline = y + height;

  return rainbowDefaultColors.map((color, index) => {
    const outerRx = Math.max(0.1, width / 2 - index * bandSize);
    const outerRy = Math.max(0.1, height - index * bandSize);
    const innerRx = Math.max(0.1, outerRx - bandSize);
    const innerRy = Math.max(0.1, outerRy - bandSize);
    const path = [
      `M ${centerX - outerRx} ${baseline}`,
      `A ${outerRx} ${outerRy} 0 0 1 ${centerX + outerRx} ${baseline}`,
      `L ${centerX + innerRx} ${baseline}`,
      `A ${innerRx} ${innerRy} 0 0 0 ${centerX - innerRx} ${baseline}`,
      'Z',
    ].join(' ');
    return { color, path };
  });
}

function ResizeHandles({
  id,
  left,
  top,
  right,
  bottom,
  showSideHandles,
  rotationLabel,
  onResizePointerDown,
}: {
  id: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
  showSideHandles: boolean;
  rotationLabel: string;
  onResizePointerDown: (e: React.PointerEvent<SVGElement>, id: string, handle: ResizeHandle) => void;
}) {
  const size = 10;
  const handles: Array<{ handle: ResizeHandle; x: number; y: number; cursor: string }> = [
    { handle: 'nw', x: left, y: top, cursor: 'nwse-resize' },
    { handle: 'ne', x: right, y: top, cursor: 'nesw-resize' },
    { handle: 'sw', x: left, y: bottom, cursor: 'nesw-resize' },
    { handle: 'se', x: right, y: bottom, cursor: 'nwse-resize' },
    ...(showSideHandles
      ? [
          { handle: 'n' as const, x: (left + right) / 2, y: top, cursor: 'ns-resize' },
          { handle: 'e' as const, x: right, y: (top + bottom) / 2, cursor: 'ew-resize' },
          { handle: 's' as const, x: (left + right) / 2, y: bottom, cursor: 'ns-resize' },
          { handle: 'w' as const, x: left, y: (top + bottom) / 2, cursor: 'ew-resize' },
        ]
      : []),
  ];

  return (
    <>
      {handles.map(({ handle, x, y, cursor }) => (
        <rect
          key={handle}
          x={x - size / 2}
          y={y - size / 2}
          width={size}
          height={size}
          fill="#ffffff"
          stroke="#111827"
          strokeWidth={2}
          style={{ cursor }}
          data-export-ignore="true"
          onPointerDown={(e) => onResizePointerDown(e, id, handle)}
        />
      ))}
      <RotationHandle
        id={id}
        x={(left + right) / 2}
        y={top}
        label={rotationLabel}
        onResizePointerDown={onResizePointerDown}
      />
    </>
  );
}

function RotationHandle({
  id,
  x,
  y,
  label,
  onResizePointerDown,
}: {
  id: string;
  x: number;
  y: number;
  label: string;
  onResizePointerDown: (e: React.PointerEvent<SVGElement>, id: string, handle: ResizeHandle) => void;
}) {
  const handleY = Math.max(12, y - 28);
  return (
    <g data-export-ignore="true">
      <line
        x1={x}
        y1={y}
        x2={x}
        y2={handleY}
        stroke="#7c3aed"
        strokeWidth={2}
        pointerEvents="none"
      />
      <circle
        cx={x}
        cy={handleY}
        r={8}
        fill="#fff"
        stroke="#7c3aed"
        strokeWidth={3}
        style={{ cursor: 'grab', touchAction: 'none' }}
        aria-label={label}
        onPointerDown={(event) => onResizePointerDown(event, id, 'rotate')}
      />
    </g>
  );
}

export function Canvas({
  shapes,
  selectedId,
  editingTextId,
  setEditingTextId,
  tool,
  language,
  backgroundColor,
  gridEnabled,
  gridSize,
  svgRef,
  onTextChange,
  onCanvasPointerDown,
  onShapePointerDown,
  onResizePointerDown,
  onPointerMove,
  onPointerUp,
  onPointerLeave,
}: CanvasProps) {
  const t = translations[language];
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = React.useState(100);
  const [viewportSize, setViewportSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setViewportSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  const handleCanvasPointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (tool === 'select') setEditingTextId(null);
    onCanvasPointerDown(event);
  };
  const handleShapePointerDown = (event: React.PointerEvent<SVGElement>, id: string) => {
    if (id !== selectedId) {
      const shape = shapes.find((candidate) => candidate.id === id);
      setEditingTextId(shape?.type === 'text' && shape.text.length === 0 ? id : null);
    }
    onShapePointerDown(event, id);
  };
  const zoomFactor = zoom / 100;
  const viewWidth = viewportSize.width / zoomFactor;
  const viewHeight = viewportSize.height / zoomFactor;
  const viewBox = viewportSize.width > 0 && viewportSize.height > 0
    ? `${(viewportSize.width - viewWidth) / 2} ${(viewportSize.height - viewHeight) / 2} ${viewWidth} ${viewHeight}`
    : undefined;

  return (
    <div ref={viewportRef} className="canvas-viewport">
      <svg
        ref={svgRef}
        viewBox={viewBox}
        preserveAspectRatio="none"
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerLeave}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          background: backgroundColor,
          cursor: tool === 'select' ? 'default' : 'crosshair',
          touchAction: 'none',
        }}
      >
      {gridEnabled && (
        <defs>
          <pattern
            id="ritis-grid"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1"
              opacity="0.42"
            />
          </pattern>
        </defs>
      )}
      {gridEnabled && (
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#ritis-grid)"
          pointerEvents="none"
          data-export-ignore="true"
        />
      )}
      {shapes.map((shape) => {
        const isSelected = shape.id === selectedId;
        const shapeOpacity = shape.opacity ?? 1;
        const rotationCenter = getShapeRotationCenter(shape);
        const rotationTransform = shape.rotation
          ? `rotate(${shape.rotation} ${rotationCenter.x} ${rotationCenter.y})`
          : undefined;
        const colorParts = getShapeColorParts(shape);
        const getPartColor = (key: ShapeColorPartKey) => colorParts.find((part) => part.key === key)?.color;
        const sharedProps = {
          fill: shape.type === 'rainbow' || shape.type === 'line' ? 'none' : shape.color,
          stroke: shape.type === 'line' ? shape.color : isSelected ? '#111827' : 'none',
          fillOpacity: shapeOpacity,
          strokeOpacity: shape.type === 'line' ? shapeOpacity : 1,
          strokeWidth: shape.type === 'line' ? shape.strokeWidth ?? 4 : isSelected ? 2 : 0,
          strokeDasharray: isSelected && shape.type !== 'line' ? '5,5' : undefined,
          style: { cursor: tool === 'select' ? 'move' : 'crosshair' },
          onPointerDown: (e: React.PointerEvent<SVGElement>) => handleShapePointerDown(e, shape.id),
        };

        if (shape.type === 'freehand') {
          return (
            <g
              key={shape.id}
              transform={rotationTransform}
              style={{ cursor: tool === 'select' ? 'move' : 'crosshair' }}
              onPointerDown={(e) => handleShapePointerDown(e, shape.id)}
            >
              <path
                d={createFreehandPath(shape.points)}
                transform={`matrix(${shape.width} 0 0 ${shape.height} ${shape.x} ${shape.y})`}
                fill="none"
                stroke={shape.color}
                opacity={shapeOpacity}
                strokeWidth={shape.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              {isSelected && (
                <rect
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  fill="none"
                  stroke="#111827"
                  strokeDasharray="5,5"
                  style={{ pointerEvents: 'none' }}
                  data-export-ignore="true"
                />
              )}
              {isSelected && tool === 'select' && (
                <ResizeHandles
                  id={shape.id}
                  rotationLabel={t.rotation}
                  left={shape.x}
                  top={shape.y}
                  right={shape.x + shape.width}
                  bottom={shape.y + shape.height}
                  showSideHandles={true}
                  onResizePointerDown={onResizePointerDown}
                />
              )}
            </g>
          );
        }

        if (shape.type === 'line') {
          return (
            <g key={shape.id} transform={rotationTransform}>
              <line x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2} strokeLinecap="round" {...sharedProps} />
              {isSelected && (
                <line
                  x1={shape.x1}
                  y1={shape.y1}
                  x2={shape.x2}
                  y2={shape.y2}
                  stroke="#111827"
                  strokeWidth={8}
                  strokeDasharray="5,5"
                  style={{ pointerEvents: 'none' }}
                  data-export-ignore="true"
                />
              )}
              {isSelected && tool === 'select' && (
                <>
                  <circle
                    cx={shape.x1}
                    cy={shape.y1}
                    r={10}
                    fill="#ffffff"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    style={{ cursor: 'grab', touchAction: 'none' }}
                    aria-label={t.lineStartPoint}
                    data-export-ignore="true"
                    onPointerDown={(e) => onResizePointerDown(e, shape.id, 'line-start')}
                  />
                  <circle
                    cx={shape.x2}
                    cy={shape.y2}
                    r={10}
                    fill="#ffffff"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    style={{ cursor: 'grab', touchAction: 'none' }}
                    aria-label={t.lineEndPoint}
                    data-export-ignore="true"
                    onPointerDown={(e) => onResizePointerDown(e, shape.id, 'line-end')}
                  />
                  <RotationHandle
                    id={shape.id}
                    x={(Math.min(shape.x1, shape.x2) + Math.max(shape.x1, shape.x2)) / 2}
                    y={Math.min(shape.y1, shape.y2)}
                    label={t.rotation}
                    onResizePointerDown={onResizePointerDown}
                  />
                </>
              )}
            </g>
          );
        }

        if (shape.type === 'text') {
          const textWidth = Math.max(shape.fontSize, shape.text.length * shape.fontSize * 0.65);
          const textHeight = shape.fontSize * 1.3;
          const isEditing = isSelected && tool === 'select' && editingTextId === shape.id;
          const showTextSelection = isSelected && tool === 'select';
          return (
            <g key={shape.id} transform={rotationTransform} style={{ cursor: tool === 'select' ? 'move' : 'crosshair' }}>
              <rect
                x={shape.x}
                y={shape.y}
                width={textWidth}
                height={textHeight}
                fill="transparent"
                stroke={showTextSelection ? '#111827' : 'none'}
                strokeWidth={showTextSelection ? 1 : 0}
                strokeDasharray={showTextSelection ? '5,5' : undefined}
                aria-label={t.doubleClickToEditText}
                onPointerDown={(e) => handleShapePointerDown(e, shape.id)}
                onDoubleClick={(e) => {
                  if (tool !== 'select' || !isSelected) return;
                  e.stopPropagation();
                  setEditingTextId(shape.id);
                }}
              />
              {isEditing && (
                <foreignObject
                  x={shape.x}
                  y={shape.y}
                  width={textWidth}
                  height={textHeight}
                  data-export-ignore="true"
                >
                  <input
                    type="text"
                    value={shape.text}
                    aria-label={t.editTextOnCanvas}
                    autoFocus
                    onChange={(e) => onTextChange(shape.id, e.target.value)}
                    onBlur={() => setEditingTextId(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === 'Escape') {
                        e.currentTarget.blur();
                      }
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    style={{
                      width: '100%',
                      height: '100%',
                      boxSizing: 'border-box',
                      padding: '0 2px',
                      border: 'none',
                      outline: 'none',
                      background: 'white',
                      color: shape.color,
                      caretColor: shape.color,
                      opacity: shapeOpacity,
                      fontSize: `${shape.fontSize}px`,
                      fontFamily: shape.fontFamily ?? 'Arial, sans-serif',
                      lineHeight: `${shape.fontSize}px`,
                    }}
                  />
                </foreignObject>
              )}
              {!isEditing && (
                <text
                  x={shape.x}
                  y={shape.y + shape.fontSize}
                  fill={shape.color}
                  fillOpacity={shapeOpacity}
                  opacity={shapeOpacity}
                  fontSize={shape.fontSize}
                  fontFamily={shape.fontFamily ?? 'Arial, sans-serif'}
                  style={{ pointerEvents: 'none' }}
                >
                  {shape.text}
                </text>
              )}
              {isSelected && tool === 'select' && (
                <RotationHandle
                  id={shape.id}
                  x={shape.x + textWidth / 2}
                  y={shape.y}
                  label={t.rotation}
                  onResizePointerDown={onResizePointerDown}
                />
              )}
            </g>
          );
        }

        if (shape.type === 'rect') {
          return (
            <g key={shape.id} transform={rotationTransform}>
              <rect x={shape.x} y={shape.y} width={shape.width} height={shape.height} {...sharedProps} />
              {isSelected && tool === 'select' && (
                <ResizeHandles
                  id={shape.id}
                  rotationLabel={t.rotation}
                  left={shape.x}
                  top={shape.y}
                  right={shape.x + shape.width}
                  bottom={shape.y + shape.height}
                  showSideHandles={true}
                  onResizePointerDown={onResizePointerDown}
                />
              )}
            </g>
          );
        }

        if (shape.type === 'circle') {
          // Äldre sparade cirklar saknar rx och ry och använder därför r som radie.
          const rx = shape.rx ?? shape.r;
          const ry = shape.ry ?? shape.r;
          const left = shape.cx - rx;
          const top = shape.cy - ry;
          const right = shape.cx + rx;
          const bottom = shape.cy + ry;
          return (
            <g key={shape.id} transform={rotationTransform}>
              <ellipse cx={shape.cx} cy={shape.cy} rx={rx} ry={ry} {...sharedProps} />
              {isSelected && tool === 'select' && (
                <ResizeHandles
                  id={shape.id}
                  rotationLabel={t.rotation}
                  left={left}
                  top={top}
                  right={right}
                  bottom={bottom}
                  showSideHandles={true}
                  onResizePointerDown={onResizePointerDown}
                />
              )}
            </g>
          );
        }

        if (shape.type === 'rabbit') {
          return (
            <g key={shape.id} transform={rotationTransform}>
              <path d={createRabbitPath(shape.x, shape.y, shape.width, shape.height)} {...sharedProps} />
              {isSelected && tool === 'select' && (
                <ResizeHandles
                  id={shape.id}
                  rotationLabel={t.rotation}
                  left={shape.x}
                  top={shape.y}
                  right={shape.x + shape.width}
                  bottom={shape.y + shape.height}
                  showSideHandles={true}
                  onResizePointerDown={onResizePointerDown}
                />
              )}
            </g>
          );
        }

        if (shape.type === 'cloud') {
          return (
            <g key={shape.id} transform={rotationTransform}>
              <path d={createCloudPath(shape.x, shape.y, shape.width, shape.height)} {...sharedProps} />
              {isSelected && tool === 'select' && (
                <ResizeHandles
                  id={shape.id}
                  rotationLabel={t.rotation}
                  left={shape.x}
                  top={shape.y}
                  right={shape.x + shape.width}
                  bottom={shape.y + shape.height}
                  showSideHandles={true}
                  onResizePointerDown={onResizePointerDown}
                />
              )}
            </g>
          );
        }

        if (
          shape.type === 'sun'
          || shape.type === 'star'
          || shape.type === 'gingerbread'
          || shape.type === 'flower'
          || shape.type === 'leaf'
        ) {
          const centerX = shape.x + shape.width / 2;
          const centerY = shape.y + shape.height / 2;
          const size = Math.min(shape.width, shape.height);
          let drawing: React.ReactNode;

          if (shape.type === 'sun') {
            const radius = size * 0.31;
            const rayStart = size * 0.36;
            const rayEnd = size * 0.47;
            drawing = (
              <g>
                {Array.from({ length: 8 }, (_, index) => {
                  const angle = index * Math.PI / 4;
                  return (
                    <line
                      key={index}
                      x1={centerX + Math.cos(angle) * rayStart}
                      y1={centerY + Math.sin(angle) * rayStart}
                      x2={centerX + Math.cos(angle) * rayEnd}
                      y2={centerY + Math.sin(angle) * rayEnd}
                      stroke={getPartColor('sun-rays')}
                      strokeWidth={Math.max(2, size * 0.07)}
                      strokeLinecap="round"
                    />
                  );
                })}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={radius}
                  fill={getPartColor('sun-center')}
                />
              </g>
            );
          } else if (shape.type === 'star') {
            drawing = <path d={createStarPath(shape.x, shape.y, shape.width, shape.height)} fill={shape.color} />;
          } else if (shape.type === 'gingerbread') {
            drawing = (
              <g>
                <path
                  d={createGingerbreadPath(shape.x, shape.y, shape.width, shape.height)}
                  fill={getPartColor('gingerbread-body')}
                  stroke={getPartColor('gingerbread-outline')}
                  strokeWidth={Math.max(1.5, size * 0.02)}
                  strokeLinejoin="round"
                />
                <circle cx={shape.x + shape.width * 0.42} cy={shape.y + shape.height * 0.23} r={Math.max(1.5, size * 0.025)} fill={getPartColor('gingerbread-eyes')} />
                <circle cx={shape.x + shape.width * 0.58} cy={shape.y + shape.height * 0.23} r={Math.max(1.5, size * 0.025)} fill={getPartColor('gingerbread-eyes')} />
                <circle cx={centerX} cy={shape.y + shape.height * 0.5} r={Math.max(2, size * 0.04)} fill={getPartColor('gingerbread-button-red')} />
                <circle cx={centerX} cy={shape.y + shape.height * 0.62} r={Math.max(2, size * 0.04)} fill={getPartColor('gingerbread-button-green')} />
              </g>
            );
          } else if (shape.type === 'flower') {
            drawing = (
              <g>
                {Array.from({ length: 8 }, (_, index) => {
                  const angle = index * Math.PI / 4;
                  return (
                    <ellipse
                      key={index}
                      cx={centerX + Math.cos(angle) * shape.width * 0.25}
                      cy={centerY + Math.sin(angle) * shape.height * 0.25}
                      rx={shape.width * 0.2}
                      ry={shape.height * 0.2}
                      fill={getPartColor('flower-petals')}
                    />
                  );
                })}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={size * 0.16}
                  fill={getPartColor('flower-center')}
                />
              </g>
            );
          } else {
            drawing = (
              <g>
                <path
                  d={createLeafPath(shape.x, shape.y, shape.width, shape.height)}
                  fill={getPartColor('leaf-body')}
                  stroke={getPartColor('leaf-outline')}
                  strokeWidth={Math.max(1.5, size * 0.02)}
                />
                <path
                  d={[
                    `M ${centerX} ${shape.y + shape.height * 0.9}`,
                    `Q ${centerX} ${centerY}, ${centerX} ${shape.y + shape.height * 0.1}`,
                    `M ${centerX} ${centerY + shape.height * 0.16} L ${shape.x + shape.width * 0.27} ${centerY - shape.height * 0.06}`,
                    `M ${centerX} ${centerY + shape.height * 0.03} L ${shape.x + shape.width * 0.74} ${centerY - shape.height * 0.19}`,
                    `M ${centerX} ${centerY - shape.height * 0.12} L ${shape.x + shape.width * 0.34} ${centerY - shape.height * 0.33}`,
                  ].join(' ')}
                  fill="none"
                  stroke={getPartColor('leaf-veins')}
                  strokeWidth={Math.max(1, size * 0.015)}
                  pointerEvents="none"
                />
              </g>
            );
          }

          return (
            <g
              key={shape.id}
              transform={rotationTransform}
              style={{ cursor: tool === 'select' ? 'move' : 'crosshair' }}
              onPointerDown={(e) => handleShapePointerDown(e, shape.id)}
            >
              <g opacity={shapeOpacity}>{drawing}</g>
              {isSelected && (
                <rect
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  fill="none"
                  stroke="#111827"
                  strokeDasharray="5,5"
                  style={{ pointerEvents: 'none' }}
                  data-export-ignore="true"
                />
              )}
              {isSelected && tool === 'select' && (
                <ResizeHandles
                  id={shape.id}
                  rotationLabel={t.rotation}
                  left={shape.x}
                  top={shape.y}
                  right={shape.x + shape.width}
                  bottom={shape.y + shape.height}
                  showSideHandles={true}
                  onResizePointerDown={onResizePointerDown}
                />
              )}
            </g>
          );
        }

        if (shape.type === 'spiderweb') {
          const centerX = shape.x + shape.width / 2;
          const centerY = shape.y + shape.height / 2;
          return (
            <g
              key={shape.id}
              transform={rotationTransform}
              style={{ cursor: tool === 'select' ? 'move' : 'crosshair' }}
              onPointerDown={(e) => handleShapePointerDown(e, shape.id)}
            >
              <rect
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                fill="transparent"
              />
              <g opacity={shapeOpacity} pointerEvents="none">
                {Array.from({ length: 6 }, (_, index) => {
                  const scale = (index + 1) / 6;
                  return (
                    <ellipse
                      key={`ring-${index}`}
                      cx={centerX}
                      cy={centerY}
                      rx={shape.width * scale / 2}
                      ry={shape.height * scale / 2}
                      fill="none"
                      stroke={shape.color}
                      strokeWidth={shape.strokeWidth}
                    />
                  );
                })}
                {createSpiderwebSpokes(shape.x, shape.y, shape.width, shape.height).map((spoke, index) => (
                  <line
                    key={`spoke-${index}`}
                    {...spoke}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth}
                  />
                ))}
              </g>
              {isSelected && (
                <rect
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  fill="none"
                  stroke="#111827"
                  strokeDasharray="5,5"
                  style={{ pointerEvents: 'none' }}
                  data-export-ignore="true"
                />
              )}
              {isSelected && tool === 'select' && (
                <ResizeHandles
                  id={shape.id}
                  rotationLabel={t.rotation}
                  left={shape.x}
                  top={shape.y}
                  right={shape.x + shape.width}
                  bottom={shape.y + shape.height}
                  showSideHandles={true}
                  onResizePointerDown={onResizePointerDown}
                />
              )}
            </g>
          );
        }

        if (shape.type === 'unicorn') {
          return (
            <g
              key={shape.id}
              transform={rotationTransform}
              style={{ cursor: tool === 'select' ? 'move' : 'crosshair' }}
              onPointerDown={(e) => handleShapePointerDown(e, shape.id)}
            >
              <g opacity={shapeOpacity}>
                {createUnicornPaths(shape.x, shape.y, shape.width, shape.height, shape.color).map(({ path, fill, fillPart, stroke, strokePart, strokeWidth }, index) => (
                  <path
                    key={index}
                    d={path}
                    fill={fillPart ? getPartColor(fillPart) : fill}
                    stroke={strokePart ? getPartColor(strokePart) : stroke}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
                <ellipse
                  cx={shape.x + shape.width * 0.85}
                  cy={shape.y + shape.height * 0.46}
                  rx={Math.max(1.5, shape.width * 0.022)}
                  ry={Math.max(1.5, shape.height * 0.03)}
                  fill={getPartColor('unicorn-eye')}
                />
                <ellipse
                  cx={shape.x + shape.width * 0.855}
                  cy={shape.y + shape.height * 0.45}
                  rx={Math.max(0.7, shape.width * 0.008)}
                  ry={Math.max(0.7, shape.height * 0.01)}
                  fill={getPartColor('unicorn-white-details')}
                />
                <ellipse
                  cx={shape.x + shape.width * 0.83}
                  cy={shape.y + shape.height * 0.55}
                  rx={Math.max(1.5, shape.width * 0.025)}
                  ry={Math.max(1.5, shape.height * 0.018)}
                  fill={getPartColor('unicorn-cheek')}
                />
              </g>
              {isSelected && (
                <rect
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  fill="none"
                  stroke="#111827"
                  strokeDasharray="5,5"
                  style={{ pointerEvents: 'none' }}
                />
              )}
              {isSelected && tool === 'select' && (
                <ResizeHandles
                  id={shape.id}
                  rotationLabel={t.rotation}
                  left={shape.x}
                  top={shape.y}
                  right={shape.x + shape.width}
                  bottom={shape.y + shape.height}
                  showSideHandles={true}
                  onResizePointerDown={onResizePointerDown}
                />
              )}
            </g>
          );
        }

        if (shape.type === 'rainbow') {
          return (
            <g
              key={shape.id}
              transform={rotationTransform}
              style={{ cursor: tool === 'select' ? 'move' : 'crosshair' }}
              onPointerDown={(e) => handleShapePointerDown(e, shape.id)}
            >
              <g opacity={shapeOpacity}>
                {createRainbowBands(shape.x, shape.y, shape.width, shape.height).map(({ color, path }, index) => (
                  <path
                    key={rainbowColorPartKeys[index]}
                    d={path}
                    fill={getPartColor(rainbowColorPartKeys[index]) ?? color}
                  />
                ))}
              </g>
              {isSelected && (
                <rect
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  fill="none"
                  stroke="#111827"
                  strokeDasharray="5,5"
                  style={{ pointerEvents: 'none' }}
                />
              )}
              {isSelected && tool === 'select' && (
                <ResizeHandles
                  id={shape.id}
                  rotationLabel={t.rotation}
                  left={shape.x}
                  top={shape.y}
                  right={shape.x + shape.width}
                  bottom={shape.y + shape.height}
                  showSideHandles={true}
                  onResizePointerDown={onResizePointerDown}
                />
              )}
            </g>
          );
        }

        return (
          <g key={shape.id} transform={rotationTransform}>
            <path d={createHeartPath(shape.x, shape.y, shape.width, shape.height)} {...sharedProps} />
            {isSelected && tool === 'select' && (
              <ResizeHandles
                id={shape.id}
                rotationLabel={t.rotation}
                left={shape.x}
                top={shape.y}
                right={shape.x + shape.width}
                bottom={shape.y + shape.height}
                showSideHandles={true}
                onResizePointerDown={onResizePointerDown}
              />
            )}
          </g>
        );
      })}
      </svg>
      <div className="canvas-zoom-control">
        <label htmlFor="canvas-zoom-slider">{t.zoom}</label>
        <input
          id="canvas-zoom-slider"
          type="range"
          min={25}
          max={400}
          step={1}
          value={zoom}
          aria-label={t.zoom}
          onChange={(event) => setZoom(Number(event.target.value))}
        />
        <button
          type="button"
          className="canvas-zoom-reset"
          aria-label={t.resetZoom}
          title={t.resetZoom}
          onClick={() => setZoom(100)}
        >
          <span aria-hidden="true">🏠</span> {t.zoomHome}
        </button>
      </div>
    </div>
  );
}
