import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  collectCoverage           : true,
  collectCoverageFrom       : [
    'src/**/*.{ts,tsx,js,jsx}',
    '!**/*.d.ts',
  ],
  coveragePathIgnorePatterns: [
    '/~.*',
  ],
  coverageDirectory         : 'test_results/jest',
  coverageReporters         : [
    'clover',
    'lcov',
    'text-summary',
  ],
  globals                   : {
    'ts-jest': {
      tsconfig   : 'tests/tsconfig.json',
      babelConfig: false,
    },
  },
  moduleFileExtensions      : [
    'jsx',
    'js',
    'json',
    'tsx',
    'ts',
  ],
  moduleNameMapper          : {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/tests/file-mock.ts',
    '\\.(css|less|sass|scss)$'                                                           : '<rootDir>/tests/style-mock.ts',
    '^~/(.*)$'                                                                           : '<rootDir>/src/$1',
  },
  preset                    : 'ts-jest',
  reporters                 : [
    'default',
    [
      'jest-junit',
      {
        outputDirectory    : './test_results/jest',
        outputName         : 'junit.xml',
        ancestorSeparator  : ' > ',
        usePathForSuiteName: 'false',
      },
    ],
  ],
  setupFiles                : [
    'jest-localstorage-mock',
  ],
  setupFilesAfterEnv        : [
    '<rootDir>/tests/setup.ts',
  ],
  testEnvironment           : 'jest-environment-jsdom-global',
  testRegex                 : '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  transformIgnorePatterns   : [
    '<rootDir>/node_modules/(?!vue)',
  ],
}

export default config
