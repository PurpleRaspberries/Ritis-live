// Hanterar import, export och filsparning av ritningar med bakgrundsinställningar.
// Skapar ritningsfiler och låter användaren välja mellan JSON, JPEG, PNG och SVG.
import type { DrawingFileFormat, Layer, Shape } from '../types';
import { translations, type Language } from '../i18n';

interface SaveFilePickerOptions {
  suggestedName: string;
  excludeAcceptAllOption?: boolean;
  types: Array<{
    description: string;
    accept: Record<string, string[]>;
  }>;
}

interface SaveFileHandle {
  name: string;
  createWritable: () => Promise<{
    write: (data: Blob) => Promise<void>;
    close: () => Promise<void>;
  }>;
}

declare global {
  interface Window {
    showSaveFilePicker?: (options: SaveFilePickerOptions) => Promise<SaveFileHandle>;
  }
}

async function saveBlob(
  blob: Blob,
  suggestedName: string,
  mimeType: string,
  extension: string,
  description: string,
): Promise<boolean> {
  if (typeof window.showSaveFilePicker === 'function') {
    let fileHandle: SaveFileHandle;
    try {
      fileHandle = await window.showSaveFilePicker({
        suggestedName,
        types: [{ description, accept: { [mimeType]: [extension] } }],
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return false;
      throw error;
    }

    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
    return true;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = suggestedName;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}

export async function saveDrawingToFile(
  shapes: Shape[],
  fileName: string,
  language: Language,
  backgroundColor: string | null,
): Promise<boolean> {
  return saveDrawingAsFormat('json', shapes, null, fileName, language, backgroundColor);
}

function getSvgSize(svg: SVGSVGElement, language: Language) {
  const width = Math.round(svg.clientWidth);
  const height = Math.round(svg.clientHeight);
  if (width <= 0 || height <= 0) {
    throw new Error(translations[language].invalidCanvasSize);
  }
  return { width, height };
}

function prepareSvgForExport(
  svg: SVGSVGElement,
  width: number,
  height: number,
  backgroundColor: string | null,
): SVGSVGElement {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));
  clone.setAttribute('viewBox', `0 0 ${width} ${height}`);

  // Markeringar och storlekshandtag är redigeringshjälpmedel och ska inte följa med i exporten.
  clone.querySelectorAll('[data-export-ignore="true"]').forEach((element) => element.remove());
  clone.querySelectorAll('[stroke-dasharray]').forEach((element) => {
    element.removeAttribute('stroke-dasharray');
    element.setAttribute('stroke', 'none');
    element.setAttribute('stroke-width', '0');
  });

  if (backgroundColor !== null) {
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', String(width));
    background.setAttribute('height', String(height));
    background.setAttribute('fill', backgroundColor);
    clone.insertBefore(background, clone.firstChild);
  }

  return clone;
}

function serializeSvg(svg: SVGSVGElement): string {
  return new XMLSerializer().serializeToString(svg);
}

async function loadSvgImage(svg: SVGSVGElement, language: Language): Promise<HTMLImageElement> {
  const svgBlob = new Blob([serializeSvg(svg)], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);
  const image = new Image();

  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error(translations[language].failedToLoadForExport));
      image.src = svgUrl;
    });
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
  return image;
}

async function renderSvgToCanvas(
  svg: SVGSVGElement,
  width: number,
  height: number,
  language: Language,
): Promise<HTMLCanvasElement> {
  const image = await loadSvgImage(svg, language);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error(translations[language].failedToCreateImageSurface);
  }
  context.drawImage(image, 0, 0, width, height);
  return canvas;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  errorMessage: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const handleBlob = (blob: Blob | null) => {
      if (blob) resolve(blob);
      else reject(new Error(errorMessage));
    };
    if (quality === undefined) canvas.toBlob(handleBlob, mimeType);
    else canvas.toBlob(handleBlob, mimeType, quality);
  });
}

interface DrawingFile {
  blob: Blob;
  suggestedName: string;
  mimeType: string;
  extension: string;
  description: string;
}

function getNormalizedFileName(fileName: string): string {
  return fileName.trim().replace(/\.(json|jpe?g|png|svg)$/i, '') || 'min-ritning';
}

async function createDrawingFile(
  format: DrawingFileFormat,
  shapes: Shape[],
  svg: SVGSVGElement | null,
  fileName: string,
  language: Language,
  backgroundColor: string | null,
): Promise<DrawingFile> {
  const t = translations[language];
  const normalizedName = getNormalizedFileName(fileName);

  // JSON behåller redigerbara former; bildformat skapas från en fristående SVG-kopia.
  if (format === 'json') {
    const savedShapes = shapes.map((shape) => (
      shape.type === 'text'
        ? { ...shape, fontFamily: shape.fontFamily ?? 'Arial, sans-serif' }
        : shape
    ));
    const blob = new Blob([JSON.stringify({ shapes: savedShapes, backgroundColor }, null, 2)], {
      type: 'application/json',
    });
    return {
      blob,
      suggestedName: `${normalizedName}.json`,
      mimeType: 'application/json',
      extension: '.json',
      description: t.jsonFileType,
    };
  }

  if (!svg) throw new Error(t.missingCanvasForExport);
  const { width, height } = getSvgSize(svg, language);

  if (format === 'jpeg') {
    const exportSvg = prepareSvgForExport(svg, width, height, backgroundColor ?? '#ffffff');
    const canvas = await renderSvgToCanvas(exportSvg, width, height, language);
    const context = canvas.getContext('2d');
    if (!context) throw new Error(t.failedToCreateImageSurface);
    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    const blob = await canvasToBlob(canvas, 'image/jpeg', t.failedToCreateJpeg, 0.92);
    return {
      blob,
      suggestedName: `${normalizedName}.jpg`,
      mimeType: 'image/jpeg',
      extension: '.jpg',
      description: t.jpegFileType,
    };
  }

  if (format === 'png') {
    const exportSvg = prepareSvgForExport(svg, width, height, backgroundColor);
    const canvas = await renderSvgToCanvas(exportSvg, width, height, language);
    const blob = await canvasToBlob(canvas, 'image/png', t.failedToCreatePng);
    return {
      blob,
      suggestedName: `${normalizedName}.png`,
      mimeType: 'image/png',
      extension: '.png',
      description: t.pngFileType,
    };
  }

  const exportSvg = prepareSvgForExport(svg, width, height, backgroundColor);
  const blob = new Blob([serializeSvg(exportSvg)], { type: 'image/svg+xml;charset=utf-8' });
  return {
    blob,
    suggestedName: `${normalizedName}.svg`,
    mimeType: 'image/svg+xml',
    extension: '.svg',
    description: t.svgFileType,
  };
}

function getFormatFromFileName(fileName: string, language: Language): DrawingFileFormat {
  const extension = fileName.match(/\.([^.]+)$/)?.[1]?.toLowerCase();
  if (extension === 'json') return 'json';
  if (extension === 'jpg' || extension === 'jpeg') return 'jpeg';
  if (extension === 'png') return 'png';
  if (extension === 'svg') return 'svg';
  throw new Error(translations[language].unsupportedSaveFormat);
}

export async function saveDrawingWithFilePicker(
  shapes: Shape[],
  svg: SVGSVGElement,
  fileName: string,
  language: Language,
  backgroundColor: string | null,
): Promise<
  | { status: 'saved'; fileName: string }
  | { status: 'cancelled' | 'unsupported' }
> {
  if (typeof window.showSaveFilePicker !== 'function') return { status: 'unsupported' };

  // Filändelsen som användaren väljer avgör vilket av de stödda formaten som skrivs.
  const t = translations[language];
  let fileHandle: SaveFileHandle;
  try {
    fileHandle = await window.showSaveFilePicker({
      suggestedName: getNormalizedFileName(fileName),
      excludeAcceptAllOption: true,
      types: [
        { description: t.jsonFileType, accept: { 'application/json': ['.json'] } },
        { description: t.pngFileType, accept: { 'image/png': ['.png'] } },
        { description: t.jpegFileType, accept: { 'image/jpeg': ['.jpg', '.jpeg'] } },
        { description: t.svgFileType, accept: { 'image/svg+xml': ['.svg'] } },
      ],
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return { status: 'cancelled' };
    throw error;
  }

  const format = getFormatFromFileName(fileHandle.name, language);
  const file = await createDrawingFile(
    format,
    shapes,
    svg,
    fileHandle.name,
    language,
    backgroundColor,
  );
  const writable = await fileHandle.createWritable();
  await writable.write(file.blob);
  await writable.close();
  return { status: 'saved', fileName: fileHandle.name };
}

export async function saveDrawingAsFormat(
  format: DrawingFileFormat,
  shapes: Shape[],
  svg: SVGSVGElement | null,
  fileName: string,
  language: Language,
  backgroundColor: string | null,
): Promise<boolean> {
  const file = await createDrawingFile(format, shapes, svg, fileName, language, backgroundColor);
  return saveBlob(file.blob, file.suggestedName, file.mimeType, file.extension, file.description);
}

export async function exportDrawingToJpeg(
  svg: SVGSVGElement,
  fileName: string,
  language: Language,
  backgroundColor: string | null,
): Promise<boolean> {
  return saveDrawingAsFormat('jpeg', [], svg, fileName, language, backgroundColor);
}

export async function exportDrawingToPng(
  svg: SVGSVGElement,
  fileName: string,
  language: Language,
  backgroundColor: string | null,
): Promise<boolean> {
  return saveDrawingAsFormat('png', [], svg, fileName, language, backgroundColor);
}

export async function exportDrawingToSvg(
  svg: SVGSVGElement,
  fileName: string,
  language: Language,
  backgroundColor: string | null,
): Promise<boolean> {
  return saveDrawingAsFormat('svg', [], svg, fileName, language, backgroundColor);
}

export function loadDrawingFromFile(
  file: File,
  onLoaded: (shapes: Shape[], backgroundColor: string | null) => void,
  language: Language,
) {
  const t = translations[language];
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const content = event.target?.result as string;
      const parsedDrawing: unknown = JSON.parse(content);
      let parsedShapes: Shape[];
      let backgroundColor: string | null = '#ffffff';

      if (Array.isArray(parsedDrawing)) {
        parsedShapes = parsedDrawing;
      } else if (
        parsedDrawing
        && typeof parsedDrawing === 'object'
        && 'shapes' in parsedDrawing
        && Array.isArray(parsedDrawing.shapes)
      ) {
        parsedShapes = parsedDrawing.shapes;
        if ('backgroundColor' in parsedDrawing) {
          const savedBackground = parsedDrawing.backgroundColor;
          if (savedBackground === null) {
            backgroundColor = null;
          } else if (typeof savedBackground === 'string' && /^#[\da-f]{6}$/i.test(savedBackground)) {
            backgroundColor = savedBackground;
          } else {
            alert(t.invalidDrawing);
            return;
          }
        }
      } else {
        alert(t.invalidDrawing);
        return;
      }

      // Äldre ritningar saknar lagerfältet och måste placeras på bakgrundslagret.
      const normalizedShapes = parsedShapes.map((shape: Shape) => {
        const layer = (shape as Shape & { layer?: unknown }).layer;
        const validLayer: Layer = typeof layer === 'number' && layer >= 1 && layer <= 5
          ? (layer as Layer)
          : 1;
        return { ...shape, layer: validLayer };
      });
      onLoaded(normalizedShapes, backgroundColor);
    } catch {
      alert(t.failedToReadDrawing);
    }
  };
  reader.readAsText(file);
}
