import type { Shape, ShapeColorPartKey } from '../types';

export interface ShapeColorPart {
  key: ShapeColorPartKey;
  color: string;
}

export const rainbowColorPartKeys: ShapeColorPartKey[] = [
  'rainbow-band-1',
  'rainbow-band-2',
  'rainbow-band-3',
  'rainbow-band-4',
  'rainbow-band-5',
  'rainbow-band-6',
  'rainbow-band-7',
];

export const rainbowDefaultColors = [
  '#ef4444',
  '#f97316',
  '#facc15',
  '#22c55e',
  '#3b82f6',
  '#6366f1',
  '#a855f7',
];

export function getShapeColorParts(shape: Shape): ShapeColorPart[] {
  const defaultParts: Array<[ShapeColorPartKey, string]> = (() => {
    switch (shape.type) {
      case 'sun':
        return [['sun-rays', shape.color], ['sun-center', shape.color]];
      case 'gingerbread':
        return [
          ['gingerbread-body', shape.color],
          ['gingerbread-outline', '#92400e'],
          ['gingerbread-eyes', '#fff7ed'],
          ['gingerbread-button-red', '#ef4444'],
          ['gingerbread-button-green', '#22c55e'],
        ];
      case 'flower':
        return [['flower-petals', shape.color], ['flower-center', '#facc15']];
      case 'leaf':
        return [
          ['leaf-body', shape.color],
          ['leaf-outline', '#166534'],
          ['leaf-veins', '#166534'],
        ];
      case 'rainbow':
        return rainbowColorPartKeys.map((key, index) => [key, rainbowDefaultColors[index]]);
      case 'unicorn':
        return [
          ['unicorn-pink', '#ec4899'],
          ['unicorn-body', shape.color],
          ['unicorn-mane', '#a855f7'],
          ['unicorn-horn', '#facc15'],
          ['unicorn-ear', '#fbcfe8'],
          ['unicorn-ear-detail', '#f9a8d4'],
          ['unicorn-mane-highlight', '#22d3ee'],
          ['unicorn-muzzle', '#fbcfe8'],
          ['unicorn-brown-details', '#7c2d12'],
          ['unicorn-white-details', '#ffffff'],
          ['unicorn-star', '#facc15'],
          ['unicorn-eye', '#111827'],
          ['unicorn-cheek', '#fb7185'],
        ];
      default:
        return [];
    }
  })();

  return defaultParts.map(([key, defaultColor]) => ({
    key,
    color: shape.partColors?.[key] ?? defaultColor,
  }));
}
