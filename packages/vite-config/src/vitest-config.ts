import { mergeConfig } from 'vitest/config'
import { config } from './vite-config.js'

export default mergeConfig(config, {
  optimizeDeps: {
    exclude: ['vitest/utils'],
    include: ['@vitest/utils', 'vitest/browser'],
  },
  test: {
    environment: 'jsdom',
    reporters: ['default', 'html'],
    outputFile: { html: './coverage/report/index.html' },
    coverage: {
      provider: 'c8',
      reporter: ['text-summary', 'html-spa'],
      reportsDirectory: './coverage/cov',
    },
  },
})
