import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default {
  plugins: [tsconfigPaths()],
  test: {
    alias: {
      '@app/static-data/static-data': './mocks/static-data.ts'
    }
  }
}
