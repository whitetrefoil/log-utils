export type LogLevel = 'info'|'warn'|'error'
export const logLevels = ['info', 'warn', 'error'] as const


export function isLogLevel(level: unknown): level is LogLevel {
  return logLevels.includes(level as LogLevel)
}
