// Definierar de typer som delas av ritverktygen och programmets komponenter.
// Formernas gemensamma modell används bland annat av canvasen, lagringen och pekarlogiken.
export type Tool =
  | 'select'
  | 'rect'
  | 'circle'
  | 'line'
  | 'text'
  | 'heart'
  | 'rabbit'
  | 'rainbow'
  | 'cloud'
  | 'unicorn'
  | 'sun'
  | 'star'
  | 'gingerbread'
  | 'flower'
  | 'leaf'
  | 'spiderweb'
  | 'freehand';
export type ResizeHandle =
  | 'nw'
  | 'n'
  | 'ne'
  | 'e'
  | 'se'
  | 's'
  | 'sw'
  | 'w'
  | 'line-start'
  | 'line-end'
  | 'rotate';
export type Layer = 1 | 2 | 3 | 4 | 5;
export type DrawingFileFormat = 'json' | 'jpeg' | 'png' | 'svg';
export type ShapeColorPartKey =
  | 'sun-rays'
  | 'sun-center'
  | 'gingerbread-body'
  | 'gingerbread-outline'
  | 'gingerbread-eyes'
  | 'gingerbread-button-red'
  | 'gingerbread-button-green'
  | 'flower-petals'
  | 'flower-center'
  | 'leaf-body'
  | 'leaf-outline'
  | 'leaf-veins'
  | 'rainbow-band-1'
  | 'rainbow-band-2'
  | 'rainbow-band-3'
  | 'rainbow-band-4'
  | 'rainbow-band-5'
  | 'rainbow-band-6'
  | 'rainbow-band-7'
  | 'unicorn-pink'
  | 'unicorn-body'
  | 'unicorn-mane'
  | 'unicorn-horn'
  | 'unicorn-ear'
  | 'unicorn-ear-detail'
  | 'unicorn-mane-highlight'
  | 'unicorn-muzzle'
  | 'unicorn-brown-details'
  | 'unicorn-white-details'
  | 'unicorn-star'
  | 'unicorn-eye'
  | 'unicorn-cheek';
export const textFontFamilies = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: '"Comic Sans MS", cursive', label: 'Comic Sans MS' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: '"Courier New", monospace', label: 'Courier New' },
] as const;
export type TextFontFamily = typeof textFontFamilies[number]['value'];

// Varje ritobjekt har en egen formtyp; frihandspunkter lagras relativt objektets begränsningsruta.
export type Shape = {
  opacity?: number;
  rotation?: number;
  partColors?: Partial<Record<ShapeColorPartKey, string>>;
} & (
  | { id: string; type: 'rect'; x: number; y: number; width: number; height: number; color: string; layer: Layer }
  | { id: string; type: 'circle'; cx: number; cy: number; r: number; rx?: number; ry?: number; color: string; layer: Layer }
  | { id: string; type: 'line'; x1: number; y1: number; x2: number; y2: number; strokeWidth?: number; color: string; layer: Layer }
  | { id: string; type: 'text'; x: number; y: number; text: string; fontSize: number; fontFamily?: TextFontFamily; color: string; layer: Layer }
  | { id: string; type: 'heart'; x: number; y: number; width: number; height: number; color: string; layer: Layer }
  | { id: string; type: 'rabbit'; x: number; y: number; width: number; height: number; color: string; layer: Layer }
  | { id: string; type: 'rainbow'; x: number; y: number; width: number; height: number; layer: Layer }
  | { id: string; type: 'cloud'; x: number; y: number; width: number; height: number; color: string; layer: Layer }
  | { id: string; type: 'unicorn'; x: number; y: number; width: number; height: number; color: string; layer: Layer }
  | { id: string; type: 'sun'; x: number; y: number; width: number; height: number; color: string; layer: Layer }
  | { id: string; type: 'star'; x: number; y: number; width: number; height: number; color: string; layer: Layer }
  | { id: string; type: 'gingerbread'; x: number; y: number; width: number; height: number; color: string; layer: Layer }
  | { id: string; type: 'flower'; x: number; y: number; width: number; height: number; color: string; layer: Layer }
  | { id: string; type: 'leaf'; x: number; y: number; width: number; height: number; color: string; layer: Layer }
  | { id: string; type: 'spiderweb'; x: number; y: number; width: number; height: number; strokeWidth: number; color: string; layer: Layer }
  | {
      id: string;
      type: 'freehand';
      x: number;
      y: number;
      width: number;
      height: number;
      points: Array<{ x: number; y: number }>;
      strokeWidth: number;
      color: string;
      layer: Layer;
    }
);
