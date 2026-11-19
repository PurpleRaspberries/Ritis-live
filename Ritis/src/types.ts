// Definierar de typer som delas av ritverktygen och programmets komponenter.
// Formernas gemensamma modell används bland annat av canvasen, lagringen och pekarlogiken.
export type Tool = 'select' | 'rect' | 'circle' | 'line' | 'text' | 'heart' | 'rabbit' | 'rainbow' | 'cloud' | 'unicorn';
export type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
export type Layer = 1 | 2 | 3 | 4 | 5;

export type Shape =
  | { id: string; type: 'rect'; x: number; y: number; width: number; height: number; color: string; layer: Layer }
  | { id: string; type: 'circle'; cx: number; cy: number; r: number; rx?: number; ry?: number; color: string; layer: Layer }
  | { id: string; type: 'line'; x1: number; y1: number; x2: number; y2: number; color: string; layer: Layer }
  | { id: string; type: 'text'; x: number; y: number; text: string; fontSize: number; color: string; layer: Layer }
  | { id: string; type: 'heart'; x: number; y: number; width: number; height: number; color: string; layer: Layer }
  | { id: string; type: 'rabbit'; x: number; y: number; width: number; height: number; color: string; layer: Layer }
  | { id: string; type: 'rainbow'; x: number; y: number; width: number; height: number; layer: Layer }
  | { id: string; type: 'cloud'; x: number; y: number; width: number; height: number; color: string; layer: Layer }
  | { id: string; type: 'unicorn'; x: number; y: number; width: number; height: number; color: string; layer: Layer };
