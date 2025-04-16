export type LogLevel = 'info'|'warn'|'error'
export const logLevels = ['info', 'warn', 'error'] as const


export function isLogLevel(level: unknown): level is LogLevel {
  return logLevels.includes(level as LogLevel)
}


let globalLevel: LogLevel|undefined


export function setGlobalLevel(level: LogLevel|undefined) {
  if (level !== undefined && !logLevels.includes(level)) {
    throw new Error(`Invalid log level: ${level}`)
  }

  if (typeof window !== 'undefined') {
    if (level === undefined) {
      window.localStorage.removeItem('log-level')
      window.sessionStorage.removeItem('log-level')
    } else {
      window.localStorage.setItem('log-level', level)
      window.sessionStorage.setItem('log-level', level)
    }
  }

  globalLevel = level
}


export function getGlobalLevel() {
  return globalLevel
}


function getGlobalLevelFromEnv(): LogLevel|undefined {
  if (typeof window !== 'undefined') {
    const level = window.localStorage.getItem('log-level') ?? window.sessionStorage.getItem('log-level')
    if (isLogLevel(level)) return level
  }

  const metaEnv = import.meta as {env?: {}}

  if ('env' in metaEnv
    && typeof metaEnv.env === 'object'
    && 'LOG_LEVEL' in metaEnv.env
    && isLogLevel(metaEnv.env.LOG_LEVEL)) {
    return metaEnv.env.LOG_LEVEL
  }

  if (isLogLevel(process.env.LOG_LEVEL)) {
    return process.env.LOG_LEVEL
  }

  return undefined
}


function initialGlobalLevel() {
  const level = getGlobalLevelFromEnv()
  setGlobalLevel(level)
}


initialGlobalLevel()
