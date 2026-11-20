<!-- Beskriver hur man använder Ritis, hur projektet är uppbyggt och vanliga npm-kommandon. -->
# Ritis

Ritis är en enkel, barnvänlig ritapp byggd med React, TypeScript och Vite.

## Använda ritverktygen

- **Frihand** är valt från början: dra direkt på ritytan för att rita med pennan. Varje sammanhängande streck blir ett flyttbart objekt. Markera ett frihandsstreck eller en linje med **Flytta/markera** för att ändra färg och tjocklek; färgväljaren och tjockleksreglaget visas ovanför egenskapspanelen. Dra i linjens ändpunkter för att flytta dem separat.
- Färgväljaren finns ovanför egenskapspanelen. När du markerar text kan du ändra textstorlek och välja mellan Arial, Comic Sans MS, Georgia och Courier New.
- Det valda typsnittet sparas i JSON-ritningar, anges i SVG-filer och ritas in i PNG- och JPEG-bilder.
- Webbläsarfliken visar **Ritis - Ny** för en osparad ritning. När en ritning öppnas eller sparas visas **Ritis - filnamn**, utan filändelse.
- Öppna **Figurer** för att rita hjärta, kanin, regnbåge, moln, enhörning, sol, stjärna, pepparkaka, blomma eller blad.
- Välj **Flytta/markera** för att markera och flytta objekt. Dra i en linjes ändpunkter för att ändra linjen. **Kopiera vald** skapar en förskjuten kopia av det markerade objektet (**Ctrl/Cmd+D**). **Ta bort vald sak** tar bort objektet.
- **Ångra** och **Gör om** återställer eller upprepar ändringar. Använd **Ctrl/Cmd+Z** för att ångra och **Ctrl/Cmd+Y** eller **Ctrl/Cmd+Shift+Z** för att göra om.
- **Börja om** frågar först om du vill rensa hela ritningen.
- Under **Fler val** kan du byta språk, välja lager och bakgrundsfärg eller göra bakgrunden genomskinlig. Använd **Spara / exportera** för att välja JSON, PNG, JPEG eller SVG i samma filruta. Du kan även öppna en tidigare sparad ritning och läsa mer om Ritis under **Om Ritis**.
- En genomskinlig bakgrund sparas i ritningsfilen. PNG och SVG kan behålla transparensen; JPEG får vit bakgrund.

## Projektstruktur

- `index.html` och `src/main.tsx` startar appen och laddar den globala stilen.
- `src/App.tsx` håller appens tillstånd och kopplar samman verktygsfält, canvas och egenskapspanel.
- `src/components/` innehåller gränssnittets delar, inklusive dialoger för bakgrund, omstart och information om Ritis.
- `src/hooks/usePointerEvents.ts` hanterar ritning, markering, flytt och storleksändring.
- `src/utils/` innehåller hjälpfunktioner för koordinater samt import och export av ritningar.
- `src/types.ts` samlar gemensamma TypeScript-typer för verktyg, lager och former.
- `src/i18n.ts` innehåller användartexter på svenska, engelska och tyska.
- `src/index.css` innehåller globala stilar. `src/assets/` och `public/` innehåller statiska resurser.
- `vite.config.ts` och `tsconfig*.json` innehåller inställningar för byggverktyget och TypeScript.

## Kom igång

Installera beroenden och starta utvecklingsservern:

```sh
npm install
npm run dev
```

## Vanliga kommandon

- `npm run build` – typkontrollerar och bygger appen för produktion.
- `npm run lint` – kontrollerar koden med Oxlint.
- `npm run preview` – visar den färdigbyggda appen lokalt.
