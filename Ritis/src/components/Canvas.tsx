// Ritar canvasens bakgrund, former och redigeringshandtag i SVG.
// Tar emot data och pekarhändelser från App och skickar textändringar tillbaka.
import React from 'react';
import type { ResizeHandle, Shape, Tool } from '../types';
import { translations, type Language } from '../i18n';

interface CanvasProps {
  shapes: Shape[];
  selectedId: string | null;
  tool: Tool;
  language: Language;
  backgroundColor: string;
  svgRef: React.Ref<SVGSVGElement>;
  onTextChange: (id: string, text: string) => void;
  onCanvasPointerDown: (e: React.PointerEvent<SVGSVGElement>) => void;
  onShapePointerDown: (e: React.PointerEvent<SVGElement>, id: string) => void;
  onResizePointerDown: (e: React.PointerEvent<SVGRectElement>, id: string, handle: ResizeHandle) => void;
  onPointerMove: (e: React.PointerEvent<SVGSVGElement>) => void;
  onPointerUp: () => void;
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

function createUnicornPaths(
  x: number,
  y: number,
  w: number,
  h: number,
  bodyColor: string,
): Array<{ fill: string; path: string; stroke?: string; strokeWidth?: number }> {
  const sx = w / 100;
  const sy = h / 100;
  const p = (px: number, py: number) => `${x + px * sx} ${y + py * sy}`;

  return [
    {
      fill: '#ec4899',
      path: [
        `M ${p(19, 57)}`,
        `C ${p(9, 49)}, ${p(5, 58)}, ${p(14, 64)}`,
        `C ${p(5, 70)}, ${p(12, 78)}, ${p(21, 70)}`,
        `C ${p(24, 66)}, ${p(24, 61)}, ${p(19, 57)} Z`,
      ].join(' '),
    },
    {
      fill: bodyColor,
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
      path: `M ${p(71, 34)} L ${p(77, 5)} L ${p(83, 38)} Z`,
    },
    {
      fill: '#fbcfe8',
      path: `M ${p(60, 33)} L ${p(62, 17)} L ${p(72, 32)} Z`,
    },
    {
      fill: '#f9a8d4',
      path: `M ${p(63, 30)} L ${p(63, 21)} L ${p(69, 31)} Z`,
    },
    {
      fill: '#ec4899',
      path: [
        `M ${p(51, 37)}`,
        `C ${p(46, 35)}, ${p(45, 40)}, ${p(50, 44)}`,
        `C ${p(54, 46)}, ${p(58, 48)}, ${p(60, 52)}`,
        `C ${p(60, 46)}, ${p(57, 41)}, ${p(51, 37)} Z`,
      ].join(' '),
    },
    {
      fill: '#22d3ee',
      path: [
        `M ${p(47, 51)}`,
        `C ${p(43, 48)}, ${p(42, 54)}, ${p(48, 58)}`,
        `C ${p(52, 60)}, ${p(55, 62)}, ${p(56, 67)}`,
        `C ${p(60, 61)}, ${p(55, 55)}, ${p(47, 51)} Z`,
      ].join(' '),
    },
    {
      fill: '#fbcfe8',
      path: [
        `M ${p(88, 48)}`,
        `C ${p(94, 47)}, ${p(97, 50)}, ${p(94, 53)}`,
        `C ${p(92, 55)}, ${p(87, 54)}, ${p(85, 52)} Z`,
      ].join(' '),
    },
    {
      fill: 'none',
      stroke: '#7c2d12',
      strokeWidth: 2,
      path: `M ${p(88, 56)} C ${p(91, 59)}, ${p(95, 57)}, ${p(96, 55)}`,
    },
    {
      fill: 'none',
      stroke: '#ffffff',
      strokeWidth: 2,
      path: `M ${p(74, 25)} L ${p(77, 29)} L ${p(79, 24)}`,
    },
    {
      fill: 'none',
      stroke: '#7c2d12',
      strokeWidth: 2,
      path: `M ${p(26, 83)} L ${p(34, 83)} M ${p(55, 83)} L ${p(63, 83)}`,
    },
    {
      fill: '#facc15',
      path: `M ${p(42, 56)} L ${p(43, 59)} L ${p(46, 59)} L ${p(44, 61)} L ${p(45, 64)} L ${p(42, 62)} L ${p(40, 64)} L ${p(41, 61)} L ${p(39, 59)} L ${p(42, 59)} Z`,
    },
  ];
}

// Varje färgband är ett halvt ringsegment, där nästa radie blir mindre åt samma centrum.
function createRainbowBands(x: number, y: number, width: number, height: number) {
  const colors = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#6366f1', '#a855f7'];
  const bandSize = Math.max(0.1, Math.min(width / 16, height / 8));
  const centerX = x + width / 2;
  const baseline = y + height;

  return colors.map((color, index) => {
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
  onResizePointerDown,
}: {
  id: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
  showSideHandles: boolean;
  onResizePointerDown: (e: React.PointerEvent<SVGRectElement>, id: string, handle: ResizeHandle) => void;
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
    </>
  );
}

export function Canvas({
  shapes,
  selectedId,
  tool,
  language,
  backgroundColor,
  svgRef,
  onTextChange,
  onCanvasPointerDown,
  onShapePointerDown,
  onResizePointerDown,
  onPointerMove,
  onPointerUp,
}: CanvasProps) {
  const t = translations[language];
  const [editingTextId, setEditingTextId] = React.useState<string | null>(null);
  const shapesRef = React.useRef(shapes);
  shapesRef.current = shapes;

  React.useEffect(() => {
    if (tool !== 'select') {
      setEditingTextId(null);
      return;
    }

    if (!selectedId) {
      setEditingTextId(null);
      return;
    }

    const selectedShape = shapesRef.current.find((shape) => shape.id === selectedId);
    if (selectedShape?.type === 'text') {
      if (selectedShape.text.length === 0) {
        setEditingTextId(selectedShape.id);
      }
    } else {
      setEditingTextId(null);
    }
  }, [selectedId, tool]);

  return (
    <svg
      ref={svgRef}
      onPointerDown={onCanvasPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        flex: 1,
        background: backgroundColor,
        cursor: tool === 'select' ? 'default' : 'crosshair',
        touchAction: 'none',
      }}
    >
      {shapes.map((shape) => {
        const isSelected = shape.id === selectedId;
        const sharedProps = {
          fill: shape.type === 'rainbow' || shape.type === 'line' ? 'none' : shape.color,
          stroke: shape.type === 'line' ? shape.color : isSelected ? '#111827' : 'none',
          strokeWidth: shape.type === 'line' ? 4 : isSelected ? 2 : 0,
          strokeDasharray: isSelected && shape.type !== 'line' ? '5,5' : undefined,
          style: { cursor: tool === 'select' ? 'move' : 'crosshair' },
          onPointerDown: (e: React.PointerEvent<SVGElement>) => onShapePointerDown(e, shape.id),
        };

        if (shape.type === 'line') {
          return (
            <g key={shape.id}>
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
            </g>
          );
        }

        if (shape.type === 'text') {
          const textWidth = Math.max(shape.fontSize, shape.text.length * shape.fontSize * 0.65);
          const textHeight = shape.fontSize * 1.3;
          const isEditing = isSelected && tool === 'select' && editingTextId === shape.id;
          const showTextSelection = isSelected && tool === 'select';
          return (
            <g key={shape.id} style={{ cursor: tool === 'select' ? 'move' : 'crosshair' }}>
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
                onPointerDown={(e) => onShapePointerDown(e, shape.id)}
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
                      fontSize: `${shape.fontSize}px`,
                      fontFamily: 'sans-serif',
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
                  fontSize={shape.fontSize}
                  style={{ pointerEvents: 'none' }}
                >
                  {shape.text}
                </text>
              )}
            </g>
          );
        }

        if (shape.type === 'rect') {
          return (
            <g key={shape.id}>
              <rect x={shape.x} y={shape.y} width={shape.width} height={shape.height} {...sharedProps} />
              {isSelected && tool === 'select' && (
                <ResizeHandles
                  id={shape.id}
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
            <g key={shape.id}>
              <ellipse cx={shape.cx} cy={shape.cy} rx={rx} ry={ry} {...sharedProps} />
              {isSelected && tool === 'select' && (
                <ResizeHandles
                  id={shape.id}
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
            <g key={shape.id}>
              <path d={createRabbitPath(shape.x, shape.y, shape.width, shape.height)} {...sharedProps} />
              {isSelected && tool === 'select' && (
                <ResizeHandles
                  id={shape.id}
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
            <g key={shape.id}>
              <path d={createCloudPath(shape.x, shape.y, shape.width, shape.height)} {...sharedProps} />
              {isSelected && tool === 'select' && (
                <ResizeHandles
                  id={shape.id}
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
              style={{ cursor: tool === 'select' ? 'move' : 'crosshair' }}
              onPointerDown={(e) => onShapePointerDown(e, shape.id)}
            >
              {createUnicornPaths(shape.x, shape.y, shape.width, shape.height, shape.color).map(({ path, fill, stroke, strokeWidth }, index) => (
                <path
                  key={index}
                  d={path}
                  fill={fill}
                  stroke={stroke}
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
                fill="#111827"
              />
              <ellipse
                cx={shape.x + shape.width * 0.855}
                cy={shape.y + shape.height * 0.45}
                rx={Math.max(0.7, shape.width * 0.008)}
                ry={Math.max(0.7, shape.height * 0.01)}
                fill="#ffffff"
              />
              <ellipse
                cx={shape.x + shape.width * 0.83}
                cy={shape.y + shape.height * 0.55}
                rx={Math.max(1.5, shape.width * 0.025)}
                ry={Math.max(1.5, shape.height * 0.018)}
                fill="#fb7185"
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
                />
              )}
              {isSelected && tool === 'select' && (
                <ResizeHandles
                  id={shape.id}
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
              style={{ cursor: tool === 'select' ? 'move' : 'crosshair' }}
              onPointerDown={(e) => onShapePointerDown(e, shape.id)}
            >
              {createRainbowBands(shape.x, shape.y, shape.width, shape.height).map(({ color, path }) => (
                <path key={color} d={path} fill={color} />
              ))}
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
          <g key={shape.id}>
            <path d={createHeartPath(shape.x, shape.y, shape.width, shape.height)} {...sharedProps} />
            {isSelected && tool === 'select' && (
              <ResizeHandles
                id={shape.id}
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
  );
}
