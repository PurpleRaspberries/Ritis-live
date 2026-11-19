// Innehåller hjälpmedel för geometriska omvandlingar i ritytan.
// Används av pekarlogiken för att räkna om skärmpositioner till SVG-koordinater.
import React from 'react';

export function getSvgCoords(e: React.PointerEvent<SVGSVGElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}
