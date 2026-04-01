import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? 'https://cdn.nav.no/klage/kabal/file-viewer/' : '/',
  plugins: [react(), tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.VERSION ?? 'local'),
  },
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    sourcemap: true,
  },
}));
