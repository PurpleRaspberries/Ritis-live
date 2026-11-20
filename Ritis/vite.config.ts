// Konfigurerar Vite som utvecklingsserver och byggverktyg för projektet.
// Aktiverar React-pluginen som behövs för att hantera appens JSX-kod.
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/Ritis/',
  plugins: [react()],
})
