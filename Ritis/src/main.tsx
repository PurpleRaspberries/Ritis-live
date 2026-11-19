// Startar webbläsarappen genom att montera React på HTML-sidans rot.
// Laddar den globala stilen och kopplar in huvudkomponenten App.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
