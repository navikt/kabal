import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const PROXY = {
  target: 'https://kabal.intern.dev.nav.no',
  changeOrigin: true,
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  build: {
    sourcemap: true,
  },
  server: {
    port: 8061,
    proxy: {
      '/api': PROXY,
      '/collaboration': { ...PROXY, ws: true },
      '/arkivert-dokument': PROXY,
      '/kombinert-dokument': PROXY,
      '/nytt-dokument': PROXY,
      '/vedleggsoversikt': PROXY,
      '/version': PROXY,
      '/oauth': PROXY,
    },
  },
});
