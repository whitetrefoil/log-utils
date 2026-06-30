import {defineConfig} from 'vitest/config'


export default defineConfig({
  root: 'src',

  test: {
    root: '.',

    reporters: ['verbose'],

    restoreMocks: true,

    unstubEnvs: true,

    setupFiles: ['tests/setup.ts'],

    coverage: {
      enabled         : true,
      include         : ['src/**/*.{ts,tsx}'],
      exclude         : ['src/stubapi/**', 'src/**/*.{test,spec}.{ts,tsx}'],
      reportsDirectory: 'test_results/vitest',
      reporter        : [['text'], ['html-spa'], ['clover', {file: 'clover.xml'}]],
    },

    typecheck: {
      enabled: true,
    },
  },
})
