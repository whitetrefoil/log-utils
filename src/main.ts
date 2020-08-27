/* eslint-disable no-console */

import cleanStack      from 'clean-stack'
import slash           from 'slash'
import { isPrimitive } from 'utility-types'

const ERR_COLOR = 'red'
// const ERR_COLOR = 'tomato';
// const ERR_COLOR = 'firebrick';

// const WARN_COLOR = 'goldenrod';
const WARN_COLOR = 'darkgoldenrod'
// const WARN_COLOR = 'orange';

// const INFO_COLOR = 'black';
// const INFO_COLOR = 'darkgray';
// const INFO_COLOR = 'dimgray';
// const INFO_COLOR = 'gray';
const INFO_COLOR = 'slategray'

// const DEBUG_COLOR = 'blue';
// const DEBUG_COLOR = 'darkcyan';
// const DEBUG_COLOR = 'darkslateblue';
// const DEBUG_COLOR = 'dodgerblue';
const DEBUG_COLOR = 'royalblue'


const TAG_COLORS = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson',
]

enum LogLevel {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Quiet = 0,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Error,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Warn,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Info,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Debug,
}

declare global {
  interface Window {
    __LOG_LEVEL__?: LogLevel
    __LOG_EXPANDED__?: boolean
  }
}

const noop = () => undefined

type ConsoleFunc = (...data: any[]) => void

type LevelDef = [ConsoleFunc, string, string]

const LevelDefs: LevelDef[] = [
  [noop, '', ''],
  [console.error, ERR_COLOR, 'ERR'],
  [console.warn, WARN_COLOR, 'WRN'],
  [console.log, INFO_COLOR, 'INF'],
  [console.log, DEBUG_COLOR, 'DEBUG'],
]


if (window.__LOG_LEVEL__ == null) {
  window.__LOG_LEVEL__ = 3
  window.__LOG_EXPANDED__ = false
}


function extractStack(err: Error): string {
  if (err.stack == null) {
    return ''
  }

  const lines = err.stack.split('\n').map(l => l.trim())
  if (lines[0] === err.message) {
    lines.splice(0, 1)
  }
  return lines.join('\n')
}

function format(...lines: unknown[]): string[] {
  const formatted: string[] = []

  lines.forEach((line, i) => {
    if (isPrimitive(line)) {
      formatted.push(String(line))
    } else if (line instanceof Error) {
      formatted.push(String(line))
      formatted.push(cleanStack(extractStack(line)))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    } else if (
      typeof (line as { toString?: unknown })?.toString === 'function' &&
      (line as { toString?: unknown })?.toString !== Object.prototype.toString
    ) {
      // If object has its own "toString" definition
      formatted.push((line as { toString: () => string }).toString())
    } else {
      const firstLine = typeof (line as { name?: unknown })?.name === 'string'
        ? (line as { name: string }).name
        : 'Complex object:'
      const restLines = JSON.stringify(line, null, 2)
      if (i === 0) {
        formatted.push(firstLine)
        formatted.push(restLines)
      } else {
        formatted.push(`${firstLine}\n${restLines}`)
      }
    }
  })

  return formatted
}


let tagColorIdx = 0


interface Logger {
  error: (headline: unknown, ...details: unknown[]) => void
  warn: (headline: unknown, ...details: unknown[]) => void
  info: (headline: unknown, ...details: unknown[]) => void
  debug: (headline: unknown, ...details: unknown[]) => void
}


const createLogger = (tag: string): Logger => {
  const tagColor = TAG_COLORS[tagColorIdx]
  tagColorIdx = (tagColorIdx + 1) % TAG_COLORS.length

  const print = (level: LogLevel, headline: unknown, ...details: unknown[]) => {
    if ((window.__LOG_LEVEL__ ?? -1) < level) {
      return
    }
    const def = LevelDefs[level]
    if (def == null) {
      return
    }
    const [fn, color, label] = def
    const formatted = format(headline, ...details)
    if (formatted.length === 0) {
      fn(
        `%c ${label} %c ${tag} %c <EMPTY>`,
        `color:white;background-color:${color}`,
        `font-weight:normal;color:${tagColor}`,
        'font-weight:normal;color:reset',
      )
      return
    }
    if (formatted.length === 1) {
      fn(
        `%c ${label} %c ${tag} %c ${formatted[0]}`,
        `color:white;background-color:${color}`,
        `font-weight:normal;color:${tagColor}`,
        'font-weight:normal;color:reset',
      )
      return
    }
    formatted.forEach((l, i) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      i === 0
        ? (window.__LOG_EXPANDED__ ?? false ? console.group : console.groupCollapsed)(
        `%c ${label} %c ${tag} %c ${l}`,
        `color:white;background-color:${color}`,
        `font-weight:normal;color:${tagColor}`,
        'font-weight:normal;color:reset',
        )
        : fn(l)
    })
    console.groupEnd()
  }

  return {
    error(headline: unknown, ...details: unknown[]): void {
      print(LogLevel.Error, headline, ...details)
    },
    warn(headline: unknown, ...details: unknown[]): void {
      print(LogLevel.Warn, headline, ...details)
    },
    info(headline: unknown, ...details: unknown[]): void {
      print(LogLevel.Info, headline, ...details)
    },
    debug(headline: unknown, ...details: unknown[]): void {
      print(LogLevel.Debug, headline, ...details)
    },
  }
}

const createMockLogger = (): Logger => ({
  error: noop,
  warn : noop,
  info : noop,
  debug: noop,
})


/**
 * @param tag - Tag in console
 * @param noPathConv - Convert path sep to slash
 */
function getLogger(tag: string, noPathConv = false): Logger {
  if (process.env.NODE_ENV === 'production') {
    return createMockLogger()
  }
  if (noPathConv === true) {
    return createLogger(tag)
  }
  const posixTag = slash(tag)
  return createLogger(posixTag)
}


export default getLogger
export { LogLevel, getLogger }
