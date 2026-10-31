// Configuration de Vite, l'outil qui lance notre site en local
import { defineConfig } from 'vite';
// Plugin qui permet à Vite de comprendre le JSX (le HTML écrit dans le JavaScript)
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
