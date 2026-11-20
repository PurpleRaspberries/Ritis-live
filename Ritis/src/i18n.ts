import type { Tool } from './types';

export type Language = 'sv' | 'en' | 'de';
export type ColorName = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'black';

export interface AppStrings {
  appTitle: string;
  toolLabels: Record<Tool, string>;
  toolInstructions: Record<Tool, string>;
  languageLabel: string;
  languageAriaLabel: string;
  languageNames: Record<Language, string>;
  toolsAriaLabel: string;
  figures: string;
  additionalFigures: string;
  moreOptions: string;
  deleteSelected: string;
  restart: string;
  restartAriaLabel: string;
  layer: string;
  layerOption: (layer: number) => string;
  imageName: string;
  save: string;
  saveAsJpeg: string;
  openDrawing: string;
  colorLabel: string;
  colorNames: Record<ColorName, string>;
  customColor: string;
  chooseColor: (color: string) => string;
  chooseCustomColor: string;
  propertiesTitle: string;
  noSelection: string;
  xPosition: string;
  yPosition: string;
  text: string;
  textSize: string;
  width: string;
  height: string;
  doubleClickToEditText: string;
  editTextOnCanvas: string;
  invalidDrawing: string;
  failedToReadDrawing: string;
  missingCanvasForExport: string;
  exportFailed: string;
  invalidCanvasSize: string;
  failedToLoadForExport: string;
  failedToCreateImageSurface: string;
  failedToCreateJpeg: string;
}

export const translations: Record<Language, AppStrings> = {
  sv: {
    appTitle: 'Rita och lek!',
    toolLabels: {
      select: 'Flytta',
      rect: 'Ruta',
      circle: 'Cirkel',
      line: 'Linje',
      text: 'Text',
      heart: 'Hjärta',
      rabbit: 'Kanin',
      rainbow: 'Regnbåge',
      cloud: 'Moln',
      unicorn: 'Enhörning',
    },
    toolInstructions: {
      select: 'Tryck på en sak för att flytta den.',
      rect: 'Dra på pappret för att rita en ruta.',
      circle: 'Dra på pappret för att rita en cirkel.',
      line: 'Dra på pappret för att rita en linje.',
      text: 'Tryck där du vill skriva.',
      heart: 'Dra på pappret för att rita ett hjärta.',
      rabbit: 'Dra på pappret för att rita en kanin.',
      rainbow: 'Dra på pappret för att rita en regnbåge.',
      cloud: 'Dra på pappret för att rita ett moln.',
      unicorn: 'Dra på pappret för att rita en enhörning.',
    },
    languageLabel: 'Språk',
    languageAriaLabel: 'Välj språk',
    languageNames: { sv: 'Svenska', en: 'English', de: 'Deutsch' },
    toolsAriaLabel: 'Ritverktyg',
    figures: 'Figurer',
    additionalFigures: 'Fler ritfigurer',
    moreOptions: 'Fler val',
    deleteSelected: 'Ta bort vald sak',
    restart: 'Börja om',
    restartAriaLabel: 'Börja om och rensa hela bilden',
    layer: 'Lager',
    layerOption: (layer) => `Lager ${layer}`,
    imageName: 'Namn på bilden',
    save: 'Spara',
    saveAsJpeg: 'Spara som bild',
    openDrawing: 'Öppna ritning',
    colorLabel: 'Färg',
    colorNames: {
      red: 'Röd',
      orange: 'Orange',
      yellow: 'Gul',
      green: 'Grön',
      blue: 'Blå',
      purple: 'Lila',
      pink: 'Rosa',
      black: 'Svart',
    },
    customColor: 'Egen färg',
    chooseColor: (color) => `Välj färgen ${color}`,
    chooseCustomColor: 'Välj en egen färg',
    propertiesTitle: 'Egenskaper',
    noSelection: 'Markera ett objekt för att ändra dess egenskaper.',
    xPosition: 'Placering X',
    yPosition: 'Placering Y',
    text: 'Text',
    textSize: 'Textstorlek',
    width: 'Bredd',
    height: 'Höjd',
    doubleClickToEditText: 'Dubbelklicka för att redigera texten',
    editTextOnCanvas: 'Redigera text på canvasen',
    invalidDrawing: 'Filen verkar inte vara en giltig ritning.',
    failedToReadDrawing: 'Kunde inte läsa filen. Kontrollera att det är en sparad JSON-ritning.',
    missingCanvasForExport: 'Kunde inte hitta ritytan för export.',
    exportFailed: 'JPEG-exporten misslyckades.',
    invalidCanvasSize: 'Ritytan saknar en giltig storlek.',
    failedToLoadForExport: 'Kunde inte läsa in ritningen för export.',
    failedToCreateImageSurface: 'Kunde inte skapa en bildyta för JPEG-exporten.',
    failedToCreateJpeg: 'Kunde inte skapa JPEG-filen.',
  },
  en: {
    appTitle: 'Draw and play!',
    toolLabels: {
      select: 'Move',
      rect: 'Rectangle',
      circle: 'Circle',
      line: 'Line',
      text: 'Text',
      heart: 'Heart',
      rabbit: 'Rabbit',
      rainbow: 'Rainbow',
      cloud: 'Cloud',
      unicorn: 'Unicorn',
    },
    toolInstructions: {
      select: 'Tap an object to move it.',
      rect: 'Drag on the paper to draw a rectangle.',
      circle: 'Drag on the paper to draw a circle.',
      line: 'Drag on the paper to draw a line.',
      text: 'Tap where you want to write.',
      heart: 'Drag on the paper to draw a heart.',
      rabbit: 'Drag on the paper to draw a rabbit.',
      rainbow: 'Drag on the paper to draw a rainbow.',
      cloud: 'Drag on the paper to draw a cloud.',
      unicorn: 'Drag on the paper to draw a unicorn.',
    },
    languageLabel: 'Language',
    languageAriaLabel: 'Choose language',
    languageNames: { sv: 'Svenska', en: 'English', de: 'Deutsch' },
    toolsAriaLabel: 'Drawing tools',
    figures: 'Shapes',
    additionalFigures: 'More shapes',
    moreOptions: 'More options',
    deleteSelected: 'Delete selected',
    restart: 'Start over',
    restartAriaLabel: 'Start over and clear the whole picture',
    layer: 'Layer',
    layerOption: (layer) => `Layer ${layer}`,
    imageName: 'Picture name',
    save: 'Save',
    saveAsJpeg: 'Save as picture',
    openDrawing: 'Open drawing',
    colorLabel: 'Color',
    colorNames: {
      red: 'Red',
      orange: 'Orange',
      yellow: 'Yellow',
      green: 'Green',
      blue: 'Blue',
      purple: 'Purple',
      pink: 'Pink',
      black: 'Black',
    },
    customColor: 'Custom color',
    chooseColor: (color) => `Choose ${color}`,
    chooseCustomColor: 'Choose a custom color',
    propertiesTitle: 'Properties',
    noSelection: 'Select an object to change its properties.',
    xPosition: 'X position',
    yPosition: 'Y position',
    text: 'Text',
    textSize: 'Text size',
    width: 'Width',
    height: 'Height',
    doubleClickToEditText: 'Double-click to edit the text',
    editTextOnCanvas: 'Edit text on the canvas',
    invalidDrawing: 'This does not seem to be a valid drawing.',
    failedToReadDrawing: 'Could not read the file. Make sure it is a saved JSON drawing.',
    missingCanvasForExport: 'Could not find the drawing area to export.',
    exportFailed: 'JPEG export failed.',
    invalidCanvasSize: 'The drawing area does not have a valid size.',
    failedToLoadForExport: 'Could not load the drawing for export.',
    failedToCreateImageSurface: 'Could not create an image surface for JPEG export.',
    failedToCreateJpeg: 'Could not create the JPEG file.',
  },
  de: {
    appTitle: 'Malen und spielen!',
    toolLabels: {
      select: 'Bewegen',
      rect: 'Rechteck',
      circle: 'Kreis',
      line: 'Linie',
      text: 'Text',
      heart: 'Herz',
      rabbit: 'Hase',
      rainbow: 'Regenbogen',
      cloud: 'Wolke',
      unicorn: 'Einhorn',
    },
    toolInstructions: {
      select: 'Tippe auf ein Objekt, um es zu bewegen.',
      rect: 'Ziehe über das Papier, um ein Rechteck zu malen.',
      circle: 'Ziehe über das Papier, um einen Kreis zu malen.',
      line: 'Ziehe über das Papier, um eine Linie zu malen.',
      text: 'Tippe auf die Stelle, an der du schreiben möchtest.',
      heart: 'Ziehe über das Papier, um ein Herz zu malen.',
      rabbit: 'Ziehe über das Papier, um einen Hasen zu malen.',
      rainbow: 'Ziehe über das Papier, um einen Regenbogen zu malen.',
      cloud: 'Ziehe über das Papier, um eine Wolke zu malen.',
      unicorn: 'Ziehe über das Papier, um ein Einhorn zu malen.',
    },
    languageLabel: 'Sprache',
    languageAriaLabel: 'Sprache auswählen',
    languageNames: { sv: 'Svenska', en: 'English', de: 'Deutsch' },
    toolsAriaLabel: 'Malwerkzeuge',
    figures: 'Figuren',
    additionalFigures: 'Weitere Figuren',
    moreOptions: 'Mehr Optionen',
    deleteSelected: 'Ausgewähltes löschen',
    restart: 'Neu anfangen',
    restartAriaLabel: 'Neu anfangen und das ganze Bild löschen',
    layer: 'Ebene',
    layerOption: (layer) => `Ebene ${layer}`,
    imageName: 'Bildname',
    save: 'Speichern',
    saveAsJpeg: 'Als Bild speichern',
    openDrawing: 'Zeichnung öffnen',
    colorLabel: 'Farbe',
    colorNames: {
      red: 'Rot',
      orange: 'Orange',
      yellow: 'Gelb',
      green: 'Grün',
      blue: 'Blau',
      purple: 'Lila',
      pink: 'Rosa',
      black: 'Schwarz',
    },
    customColor: 'Eigene Farbe',
    chooseColor: (color) => `Farbe ${color} auswählen`,
    chooseCustomColor: 'Eigene Farbe auswählen',
    propertiesTitle: 'Eigenschaften',
    noSelection: 'Wähle ein Objekt aus, um seine Eigenschaften zu ändern.',
    xPosition: 'Position X',
    yPosition: 'Position Y',
    text: 'Text',
    textSize: 'Textgröße',
    width: 'Breite',
    height: 'Höhe',
    doubleClickToEditText: 'Doppelklicken, um den Text zu bearbeiten',
    editTextOnCanvas: 'Text auf der Zeichenfläche bearbeiten',
    invalidDrawing: 'Diese Datei scheint keine gültige Zeichnung zu sein.',
    failedToReadDrawing: 'Datei konnte nicht gelesen werden. Stelle sicher, dass es eine gespeicherte JSON-Zeichnung ist.',
    missingCanvasForExport: 'Die Zeichenfläche für den Export wurde nicht gefunden.',
    exportFailed: 'JPEG-Export fehlgeschlagen.',
    invalidCanvasSize: 'Die Zeichenfläche hat keine gültige Größe.',
    failedToLoadForExport: 'Die Zeichnung konnte für den Export nicht geladen werden.',
    failedToCreateImageSurface: 'Die Bildfläche für den JPEG-Export konnte nicht erstellt werden.',
    failedToCreateJpeg: 'Die JPEG-Datei konnte nicht erstellt werden.',
  },
};

export function isLanguage(value: string | null): value is Language {
  return value === 'sv' || value === 'en' || value === 'de';
}
