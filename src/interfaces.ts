export type LogFn = (headline: unknown, ...details: unknown[]) => void

export interface Logger {
  error: LogFn
  warn: LogFn
  info: LogFn
  debug: LogFn
}

export type GetLoggerFn = (tag: string) => Logger
