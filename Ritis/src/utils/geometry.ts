// Innehåller hjälpmedel för geometriska omvandlingar i ritytan.
// Används av pekarlogiken för att räkna om skärmpositioner till SVG-koordinater.
import React from 'react';
import type { Shape } from '../types';

export function getSvgCoordsFromClient(svg: SVGSVGElement, clientX: number, clientY: number) {
  const matrix = svg.getScreenCTM();
  if (matrix) {
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const transformedPoint = point.matrixTransform(matrix.inverse());
    return { x: transformedPoint.x, y: transformedPoint.y };
  }

  const rect = svg.getBoundingClientRect();
  return { x: clientX - rect.left, y: clientY - rect.top };
}

export function getSvgCoords(e: React.PointerEvent<SVGSVGElement>) {
  return getSvgCoordsFromClient(e.currentTarget, e.clientX, e.clientY);
}

export function getShapeRotationCenter(shape: Shape) {
  if (shape.type === 'line') {
    return { x: (shape.x1 + shape.x2) / 2, y: (shape.y1 + shape.y2) / 2 };
  }
  if (shape.type === 'circle') {
    return { x: shape.cx, y: shape.cy };
  }
  if (shape.type === 'text') {
    const width = Math.max(shape.fontSize, shape.text.length * shape.fontSize * 0.65);
    return { x: shape.x + width / 2, y: shape.y + shape.fontSize * 1.3 / 2 };
  }
  return { x: shape.x + shape.width / 2, y: shape.y + shape.height / 2 };
}

export function getUnrotatedCoords(point: { x: number; y: number }, shape: Shape) {
  const rotation = shape.rotation ?? 0;
  if (rotation === 0) return point;

  const center = getShapeRotationCenter(shape);
  const radians = -rotation * Math.PI / 180;
  const dx = point.x - center.x;
  const dy = point.y - center.y;

  return {
    x: center.x + dx * Math.cos(radians) - dy * Math.sin(radians),
    y: center.y + dx * Math.sin(radians) + dy * Math.cos(radians),
  };
}
