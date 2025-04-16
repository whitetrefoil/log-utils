import path from 'node:path'
import tsconfigPaths from 'vite-tsconfig-paths'
import {defineConfig} from 'vitest/config'


export default defineConfig({
  root: 'src',

  plugins: [
    tsconfigPaths(),
  ],

  test: {
    root: import.meta.dirname,

    alias: [{find: /^~\/(.*)/u, replacement: path.join(import.meta.dirname, 'src/$1')}],

    reporters: ['verbose', 'junit'],

    outputFile: {
      junit: 'test_results/vitest/junit.xml',
    },

    restoreMocks: true,

    unstubEnvs  : true,

    setupFiles: ['tests/setup.ts'],

    coverage: {
      enabled         : true,
      include         : ['src/**'],
      reportsDirectory: 'test_results/vitest',
      reporter        : [
        ['text'],
        ['clover', {file: 'clover.xml'}],
        ['lcov'],
      ],
    },

    typecheck: {
      enabled: true,
    },
  },
})
