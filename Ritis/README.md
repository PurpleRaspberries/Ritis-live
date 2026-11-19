<!-- Förklarar hur Ritis-projektet är uppbyggt och var dess viktigaste delar finns.
     Ger utvecklare en snabb väg in i appens kod och vanliga npm-kommandon. -->
# Ritis

Ritis är en ritapp byggd med React, TypeScript och Vite.

## Projektstruktur

- `index.html` och `src/main.tsx` startar appen och laddar den globala stilen.
- `src/App.tsx` håller appens tillstånd och kopplar samman verktygsfält, canvas och egenskapspanel.
- `src/components/` innehåller gränssnittets delar: `Canvas`, `Toolbar`, `PropertiesPanel` och `ColorPicker`.
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
