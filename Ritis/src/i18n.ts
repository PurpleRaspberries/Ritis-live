// Samlar användartexter för svenska, engelska och tyska.
// Appens komponenter hämtar sina etiketter och felmeddelanden från dessa språksträngar.
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
  restartDialogTitle: string;
  confirmRestart: string;
  cancelRestart: string;
  confirmRestartAriaLabel: string;
  cancelRestartAriaLabel: string;
  layer: string;
  layerOption: (layer: number) => string;
  imageName: string;
  backgroundColor: string;
  backgroundDialogTitle: string;
  transparentBackground: string;
  confirmBackground: string;
  cancelBackground: string;
  jpegTransparencyNote: string;
  about: string;
  aboutTitle: string;
  aboutDescription: string;
  closeAbout: string;
  newFileName: string;
  save: string;
  saveOrExport: string;
  saveFormatTitle: string;
  cancelSave: string;
  saveAsJpeg: string;
  saveAsPng: string;
  saveAsSvg: string;
  openDrawing: string;
  saveFailed: string;
  unsupportedSaveFormat: string;
  jsonFileType: string;
  jpegFileType: string;
  pngFileType: string;
  svgFileType: string;
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
  fontFamily: string;
  width: string;
  height: string;
  penThickness: string;
  lineStartPoint: string;
  lineEndPoint: string;
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
  failedToCreatePng: string;
}

export const translations: Record<Language, AppStrings> = {
  sv: {
    appTitle: 'Ritis',
    toolLabels: {
      select: 'Flytta/markera',
      rect: 'Ruta',
      circle: 'Cirkel',
      line: 'Linje',
      text: 'Text',
      heart: 'Hjärta',
      rabbit: 'Kanin',
      rainbow: 'Regnbåge',
      cloud: 'Moln',
      unicorn: 'Enhörning',
      sun: 'Sol',
      star: 'Stjärna',
      gingerbread: 'Pepparkaka',
      flower: 'Blomma',
      leaf: 'Blad',
      freehand: 'Frihand',
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
      sun: 'Dra på pappret för att rita en sol.',
      star: 'Dra på pappret för att rita en stjärna.',
      gingerbread: 'Dra på pappret för att rita en pepparkaka.',
      flower: 'Dra på pappret för att rita en blomma.',
      leaf: 'Dra på pappret för att rita ett blad.',
      freehand: 'Dra på pappret för att rita med fri hand.',
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
    restartDialogTitle: 'Vill du börja om?',
    confirmRestart: 'Ja',
    cancelRestart: 'Nej',
    confirmRestartAriaLabel: 'Ja, rensa teckningen',
    cancelRestartAriaLabel: 'Nej, behåll teckningen',
    layer: 'Lager',
    layerOption: (layer) => `Lager ${layer}`,
    imageName: 'Namn på bilden',
    backgroundColor: 'Bakgrundsfärg',
    backgroundDialogTitle: 'Välj bakgrund',
    transparentBackground: 'Genomskinlig bakgrund',
    confirmBackground: 'Bekräfta',
    cancelBackground: 'Avbryt',
    jpegTransparencyNote: 'JPEG får vit bakgrund. PNG och SVG kan behålla genomskinligheten.',
    about: 'Om Ritis',
    aboutTitle: 'Om Ritis',
    aboutDescription: 'Ritis är en enkel ritapp för barn. Rita med färger och figurer, lägg till text, flytta objekt och spara eller exportera dina bilder.',
    closeAbout: 'Stäng',
    newFileName: 'Ny',
    save: 'Spara ritning',
    saveOrExport: 'Spara / exportera',
    saveFormatTitle: 'Välj filformat',
    cancelSave: 'Avbryt',
    saveAsJpeg: 'Exportera JPEG',
    saveAsPng: 'Exportera PNG',
    saveAsSvg: 'Exportera SVG',
    openDrawing: 'Öppna ritning',
    saveFailed: 'Kunde inte spara filen.',
    unsupportedSaveFormat: 'Välj ett av de tillgängliga filformaten.',
    jsonFileType: 'JSON-ritning',
    jpegFileType: 'JPEG-bild',
    pngFileType: 'PNG-bild',
    svgFileType: 'SVG-bild',
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
    fontFamily: 'Typsnitt',
    width: 'Bredd',
    height: 'Höjd',
    penThickness: 'Pennans tjocklek',
    lineStartPoint: 'Linjens startpunkt',
    lineEndPoint: 'Linjens slutpunkt',
    doubleClickToEditText: 'Dubbelklicka för att redigera texten',
    editTextOnCanvas: 'Redigera text på canvasen',
    invalidDrawing: 'Filen verkar inte vara en giltig ritning.',
    failedToReadDrawing: 'Kunde inte läsa filen. Kontrollera att det är en sparad JSON-ritning.',
    missingCanvasForExport: 'Kunde inte hitta ritytan för export.',
    exportFailed: 'Bildexporten misslyckades.',
    invalidCanvasSize: 'Ritytan saknar en giltig storlek.',
    failedToLoadForExport: 'Kunde inte läsa in ritningen för export.',
    failedToCreateImageSurface: 'Kunde inte skapa en bildyta för exporten.',
    failedToCreateJpeg: 'Kunde inte skapa JPEG-filen.',
    failedToCreatePng: 'Kunde inte skapa PNG-filen.',
  },
  en: {
    appTitle: 'Ritis',
    toolLabels: {
      select: 'Move/Select',
      rect: 'Rectangle',
      circle: 'Circle',
      line: 'Line',
      text: 'Text',
      heart: 'Heart',
      rabbit: 'Rabbit',
      rainbow: 'Rainbow',
      cloud: 'Cloud',
      unicorn: 'Unicorn',
      sun: 'Sun',
      star: 'Star',
      gingerbread: 'Gingerbread',
      flower: 'Flower',
      leaf: 'Leaf',
      freehand: 'Freehand',
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
      sun: 'Drag on the paper to draw a sun.',
      star: 'Drag on the paper to draw a star.',
      gingerbread: 'Drag on the paper to draw a gingerbread cookie.',
      flower: 'Drag on the paper to draw a flower.',
      leaf: 'Drag on the paper to draw a leaf.',
      freehand: 'Drag on the paper to draw freehand.',
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
    restartDialogTitle: 'Do you want to start over?',
    confirmRestart: 'Yes',
    cancelRestart: 'No',
    confirmRestartAriaLabel: 'Yes, clear the drawing',
    cancelRestartAriaLabel: 'No, keep the drawing',
    layer: 'Layer',
    layerOption: (layer) => `Layer ${layer}`,
    imageName: 'Picture name',
    backgroundColor: 'Background color',
    backgroundDialogTitle: 'Choose background',
    transparentBackground: 'Transparent background',
    confirmBackground: 'Confirm',
    cancelBackground: 'Cancel',
    jpegTransparencyNote: 'JPEG uses a white background. PNG and SVG can keep the transparency.',
    about: 'About Ritis',
    aboutTitle: 'About Ritis',
    aboutDescription: 'Ritis is a simple drawing app for children. Draw with colors and shapes, add text, move objects, and save or export your pictures.',
    closeAbout: 'Close',
    newFileName: 'New',
    save: 'Save drawing',
    saveOrExport: 'Save / export',
    saveFormatTitle: 'Choose file format',
    cancelSave: 'Cancel',
    saveAsJpeg: 'Export JPEG',
    saveAsPng: 'Export PNG',
    saveAsSvg: 'Export SVG',
    openDrawing: 'Open drawing',
    saveFailed: 'Could not save the file.',
    unsupportedSaveFormat: 'Choose one of the available file formats.',
    jsonFileType: 'JSON drawing',
    jpegFileType: 'JPEG image',
    pngFileType: 'PNG image',
    svgFileType: 'SVG image',
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
    fontFamily: 'Font',
    width: 'Width',
    height: 'Height',
    penThickness: 'Pen thickness',
    lineStartPoint: 'Line start point',
    lineEndPoint: 'Line end point',
    doubleClickToEditText: 'Double-click to edit the text',
    editTextOnCanvas: 'Edit text on the canvas',
    invalidDrawing: 'This does not seem to be a valid drawing.',
    failedToReadDrawing: 'Could not read the file. Make sure it is a saved JSON drawing.',
    missingCanvasForExport: 'Could not find the drawing area to export.',
    exportFailed: 'Image export failed.',
    invalidCanvasSize: 'The drawing area does not have a valid size.',
    failedToLoadForExport: 'Could not load the drawing for export.',
    failedToCreateImageSurface: 'Could not create an image surface for export.',
    failedToCreateJpeg: 'Could not create the JPEG file.',
    failedToCreatePng: 'Could not create the PNG file.',
  },
  de: {
    appTitle: 'Ritis',
    toolLabels: {
      select: 'Verschieben/Markieren',
      rect: 'Rechteck',
      circle: 'Kreis',
      line: 'Linie',
      text: 'Text',
      heart: 'Herz',
      rabbit: 'Hase',
      rainbow: 'Regenbogen',
      cloud: 'Wolke',
      unicorn: 'Einhorn',
      sun: 'Sonne',
      star: 'Stern',
      gingerbread: 'Lebkuchen',
      flower: 'Blume',
      leaf: 'Blatt',
      freehand: 'Freihand',
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
      sun: 'Ziehe über das Papier, um eine Sonne zu malen.',
      star: 'Ziehe über das Papier, um einen Stern zu malen.',
      gingerbread: 'Ziehe über das Papier, um einen Lebkuchen zu malen.',
      flower: 'Ziehe über das Papier, um eine Blume zu malen.',
      leaf: 'Ziehe über das Papier, um ein Blatt zu malen.',
      freehand: 'Ziehe über das Papier, um freihändig zu malen.',
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
    restartDialogTitle: 'Möchtest du neu anfangen?',
    confirmRestart: 'Ja',
    cancelRestart: 'Nein',
    confirmRestartAriaLabel: 'Ja, Zeichnung löschen',
    cancelRestartAriaLabel: 'Nein, Zeichnung behalten',
    layer: 'Ebene',
    layerOption: (layer) => `Ebene ${layer}`,
    imageName: 'Bildname',
    backgroundColor: 'Hintergrundfarbe',
    backgroundDialogTitle: 'Hintergrund auswählen',
    transparentBackground: 'Transparenter Hintergrund',
    confirmBackground: 'Übernehmen',
    cancelBackground: 'Abbrechen',
    jpegTransparencyNote: 'JPEG hat einen weißen Hintergrund. PNG und SVG können transparent bleiben.',
    about: 'Über Ritis',
    aboutTitle: 'Über Ritis',
    aboutDescription: 'Ritis ist eine einfache Mal-App für Kinder. Male mit Farben und Formen, füge Text hinzu, bewege Objekte und speichere oder exportiere deine Bilder.',
    closeAbout: 'Schließen',
    newFileName: 'Neu',
    save: 'Zeichnung speichern',
    saveOrExport: 'Speichern / exportieren',
    saveFormatTitle: 'Dateiformat auswählen',
    cancelSave: 'Abbrechen',
    saveAsJpeg: 'JPEG exportieren',
    saveAsPng: 'PNG exportieren',
    saveAsSvg: 'SVG exportieren',
    openDrawing: 'Zeichnung öffnen',
    saveFailed: 'Datei konnte nicht gespeichert werden.',
    unsupportedSaveFormat: 'Wähle eines der verfügbaren Dateiformate aus.',
    jsonFileType: 'JSON-Zeichnung',
    jpegFileType: 'JPEG-Bild',
    pngFileType: 'PNG-Bild',
    svgFileType: 'SVG-Bild',
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
    fontFamily: 'Schriftart',
    width: 'Breite',
    height: 'Höhe',
    penThickness: 'Stiftdicke',
    lineStartPoint: 'Linienanfang',
    lineEndPoint: 'Linienende',
    doubleClickToEditText: 'Doppelklicken, um den Text zu bearbeiten',
    editTextOnCanvas: 'Text auf der Zeichenfläche bearbeiten',
    invalidDrawing: 'Diese Datei scheint keine gültige Zeichnung zu sein.',
    failedToReadDrawing: 'Datei konnte nicht gelesen werden. Stelle sicher, dass es eine gespeicherte JSON-Zeichnung ist.',
    missingCanvasForExport: 'Die Zeichenfläche für den Export wurde nicht gefunden.',
    exportFailed: 'Bildexport fehlgeschlagen.',
    invalidCanvasSize: 'Die Zeichenfläche hat keine gültige Größe.',
    failedToLoadForExport: 'Die Zeichnung konnte für den Export nicht geladen werden.',
    failedToCreateImageSurface: 'Die Bildfläche für den Export konnte nicht erstellt werden.',
    failedToCreateJpeg: 'Die JPEG-Datei konnte nicht erstellt werden.',
    failedToCreatePng: 'Die PNG-Datei konnte nicht erstellt werden.',
  },
};

export function isLanguage(value: string | null): value is Language {
  return value === 'sv' || value === 'en' || value === 'de';
}
