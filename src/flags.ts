import type { LogLevel } from './main'

declare global {
  interface Window {
    __LOG_LEVEL__?: LogLevel
    __LOG_EXPANDED__?: boolean
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  namespace NodeJS {
    interface Global {
      __LOG_LEVEL__?: LogLevel
      __LOG_EXPANDED__?: boolean
    }
  }
}
