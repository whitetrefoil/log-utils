import * as dev             from './dev'
import type { GetLoggerFn } from './interfaces'
import * as prod            from './prod'

type RealLogLevel = typeof import('./dev').LogLevel

let getLogger: GetLoggerFn
let LogLevel: RealLogLevel

try {
  const pkg = process.env.NODE_ENV === 'development' ? dev : prod
  getLogger = pkg.getLogger
  LogLevel = pkg.LogLevel as RealLogLevel
} catch (e: unknown) {
  getLogger = prod.getLogger
  LogLevel = prod.LogLevel as RealLogLevel
}

export {
  getLogger,
  LogLevel,
}

export default getLogger
