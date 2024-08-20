import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  build: {
    sourcemap: true,
  },
  server: {
    port: 8061,
    proxy: {
      '/api': 'https://kabal.intern.dev.nav.no',
      '/collaboration': 'https://kabal.intern.dev.nav.no',
      '/arkivert-dokument': 'https://kabal.intern.dev.nav.no',
      '/kombinert-dokument': 'https://kabal.intern.dev.nav.no',
      '/nytt-dokument': 'https://kabal.intern.dev.nav.no',
      '/vedleggsoversikt': 'https://kabal.intern.dev.nav.no',
      '/version': 'https://kabal.intern.dev.nav.no',
    },
  },
});
