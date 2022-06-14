/* eslint-disable no-var */

import type { LogLevel } from './main.js'

declare global {
  interface Window {
    __LOG_LEVEL__?: LogLevel
    __LOG_EXPANDED__?: boolean
  }

  var __LOG_LEVEL__: LogLevel|undefined
  var __LOG_EXPANDED__: boolean|undefined
}
