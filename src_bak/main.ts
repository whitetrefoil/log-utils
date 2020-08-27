/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */

import type * as dev from './dev'

// export let LogLevel: typeof import('./dev').LogLevel
// export let getLogger: typeof import('./dev').getLogger

interface Types {
  LogLevel: dev.LogLevel
  getLogger: typeof dev.getLogger
}

let types: Types

try {
  if (process.env.NODE_ENV === 'development') {
    types = require('./dev') as Types
  } else {
    types = require('./prod') as Types
  }
} catch (e: unknown) {
  types = require('./prod') as Types
}

const { LogLevel, getLogger } = types

export default getLogger
export { LogLevel, getLogger }
