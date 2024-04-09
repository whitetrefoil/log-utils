import type {LogLevel} from './main.js'


declare global {
  interface Window {
    __LOG_LEVEL__?: LogLevel
    __LOG_EXPANDED__?: boolean
  }

  // eslint-disable-next-line no-var --- `var` must be used to extend global
  var __LOG_LEVEL__: LogLevel|undefined
  // eslint-disable-next-line no-var --- `var` must be used to extend global
  var __LOG_EXPANDED__: boolean|undefined
}
