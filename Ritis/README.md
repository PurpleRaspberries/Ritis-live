<!-- Beskriver hur man använder Ritis, hur projektet är uppbyggt och vanliga npm-kommandon. -->
# Ritis

Ritis är en enkel, barnvänlig ritapp byggd med React, TypeScript och Vite.

## Använda ritverktygen

- **Frihand** är valt från början: dra direkt på ritytan för att rita med pennan. Varje sammanhängande streck blir ett flyttbart objekt. Välj färg och pennans tjocklek i egenskapspanelen när Frihand eller Linje används.
- Öppna **Figurer** för att rita hjärta, kanin, regnbåge, moln, enhörning, sol, stjärna, pepparkaka, blomma eller blad.
- Välj **Flytta** för att markera och flytta objekt. **Ta bort vald sak** tar bort det markerade objektet.
- **Börja om** frågar först om du vill rensa hela ritningen.
- Under **Fler val** kan du byta språk, välja lager och bakgrundsfärg eller göra bakgrunden genomskinlig. Där kan du också namnge och spara ritningen, öppna en tidigare sparad ritning, exportera den som JPEG, PNG eller SVG och läsa mer om Ritis under **Om Ritis**.
- En genomskinlig bakgrund sparas i ritningsfilen. PNG och SVG kan behålla transparensen; JPEG får vit bakgrund.

## Projektstruktur

- `index.html` och `src/main.tsx` startar appen och laddar den globala stilen.
- `src/App.tsx` håller appens tillstånd och kopplar samman verktygsfält, canvas och egenskapspanel.
- `src/components/` innehåller gränssnittets delar, inklusive dialoger för bakgrund, omstart och information om Ritis.
- `src/hooks/usePointerEvents.ts` hanterar ritning, markering, flytt och storleksändring.
- `src/utils/` innehåller hjälpfunktioner för koordinater samt import och export av ritningar.
- `src/types.ts` samlar gemensamma TypeScript-typer för verktyg, lager och former.
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
