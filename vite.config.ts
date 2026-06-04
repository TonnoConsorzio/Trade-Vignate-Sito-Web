import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  // Rileva se stiamo compilando su GitHub Actions per impostare il prefisso corretto.
  // Nessuna API Key viene esposta, serve solo per il routing di GitHub Pages.
  const isGitHub = typeof process !== 'undefined' && process.env && process.env.GITHUB_ACTIONS;
  
  return {
    base: isGitHub ? '/Trade-Vignate-Sito-Web/' : '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
