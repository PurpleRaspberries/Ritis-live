// Hanterar import, export och nedladdning av ritningar.
// Anropas av App för att spara och läsa JSON samt skapa en JPEG från canvasen.
import type { Layer, Shape } from '../types';
import { translations, type Language } from '../i18n';

export function saveDrawingToFile(shapes: Shape[], fileName: string) {
  const json = JSON.stringify(shapes, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const normalizedName = fileName.trim().replace(/\.json$/i, '') || 'min-ritning';

  const link = document.createElement('a');
  link.href = url;
  link.download = `${normalizedName}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

export async function exportDrawingToJpeg(
  svg: SVGSVGElement,
  fileName: string,
  language: Language,
): Promise<void> {
  const t = translations[language];
  const width = Math.round(svg.clientWidth);
  const height = Math.round(svg.clientHeight);
  if (width <= 0 || height <= 0) {
    throw new Error(t.invalidCanvasSize);
  }

  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));
  clone.setAttribute('viewBox', `0 0 ${width} ${height}`);

  // Exporten ska innehålla ritningen utan redigeringshandtag eller markeringslinjer.
  clone.querySelectorAll('[data-export-ignore="true"]').forEach((element) => element.remove());
  clone.querySelectorAll('[stroke-dasharray]').forEach((element) => {
    element.removeAttribute('stroke-dasharray');
    element.setAttribute('stroke', 'none');
    element.setAttribute('stroke-width', '0');
  });

  // JPEG stöder ingen transparens, därför bakas ritytans vita färg in i bilden.
  const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  background.setAttribute('width', String(width));
  background.setAttribute('height', String(height));
  background.setAttribute('fill', '#ffffff');
  clone.insertBefore(background, clone.firstChild);

  const svgBlob = new Blob([new XMLSerializer().serializeToString(clone)], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const svgUrl = URL.createObjectURL(svgBlob);
  const image = new Image();

  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error(t.failedToLoadForExport));
      image.src = svgUrl;
    });
  } finally {
    URL.revokeObjectURL(svgUrl);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error(t.failedToCreateImageSurface);
  }

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  const jpegBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error(t.failedToCreateJpeg)),
      'image/jpeg',
      0.92,
    );
  });
  const jpegUrl = URL.createObjectURL(jpegBlob);
  const normalizedName = fileName.trim().replace(/\.jpe?g$/i, '') || 'min-ritning';
  const link = document.createElement('a');
  link.href = jpegUrl;
  link.download = `${normalizedName}.jpg`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(jpegUrl), 1000);
}

export function loadDrawingFromFile(
  file: File,
  onLoaded: (shapes: Shape[]) => void,
  language: Language,
) {
  const t = translations[language];
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const content = event.target?.result as string;
      const parsedShapes = JSON.parse(content);
      if (Array.isArray(parsedShapes)) {
        // Äldre ritningar saknar lagerfältet och måste placeras på bakgrundslagret.
        const normalizedShapes = parsedShapes.map((shape: Shape) => {
          const layer = (shape as Shape & { layer?: unknown }).layer;
          const validLayer: Layer = typeof layer === 'number' && layer >= 1 && layer <= 5
            ? (layer as Layer)
            : 1;
          return { ...shape, layer: validLayer };
        });
        onLoaded(normalizedShapes);
      } else {
        alert(t.invalidDrawing);
      }
    } catch {
      alert(t.failedToReadDrawing);
    }
  };
  reader.readAsText(file);
}
