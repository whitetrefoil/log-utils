import {generateConfig} from '@whitetrefoil/eslint-config'


export default [
  ...await generateConfig({
    type: 'web',
    ts  : {
      rootDir: import.meta.dirname,
    },
  }),
  {
    rules: {
      // this project is all about console output
      'no-console': [0],
    },
  },
]
