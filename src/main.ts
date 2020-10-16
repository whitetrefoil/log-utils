/* eslint-disable no-console */

import cleanStack   from 'clean-stack'
import extractStack from 'extract-stack'
import slash        from 'slash'


// region - Interfaces & Type Aliases

export type LogFn = (headline: unknown, ...details: unknown[]) => void

export interface Logger {
  error: LogFn
  warn: LogFn
  info: LogFn
  debug: LogFn
}

export type GetLoggerFn = (tag: string) => Logger

enum LogLevel {
  Quiet = 0,
  Error,
  Warn,
  Info,
  Debug,
}

type LevelDef = [LogFn, string, string]

declare global {
  interface Window {
    __LOG_LEVEL__?: LogLevel
    __LOG_EXPANDED__?: boolean
  }
}

// endregion


// region - Predefined Colors

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

// endregion


// region - Utilities

const noop = () => undefined

function getName(val: unknown): string {
  return typeof (val as { name?: unknown }).name === 'string'
    ? `${(val as { name: string }).name}:`
    : 'Complex object:'
}


function format(...lines: unknown[]): string[] {
  const formatted: string[] = []

  lines.forEach((line, i) => {
    if (line == null || typeof (line as { toString?: unknown }).toString !== 'function') {
      formatted.push(String(line))
    } else if (line instanceof Error) {
      formatted.push(String(line))
      formatted.push(cleanStack(extractStack(line)))
    } else if ((line as { toString?: unknown }).toString !== Object.prototype.toString) {
      // If object has its own "toString" definition
      formatted.push((line as { toString: () => string }).toString())
    } else if (i === 0) {
      formatted.push(getName(line))
      formatted.push(JSON.stringify(line, null, 2))
    } else {
      formatted.push(`${getName(line)}\n${JSON.stringify(line, null, 2)}`)
    }
  })

  return formatted
}


function print(tag: string, tagColor: string, level: LogLevel, headline: unknown, ...details: unknown[]): void {
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
    if (i !== 0) {
      fn(l)
      return
    }
    (window.__LOG_EXPANDED__ ? console.group : console.groupCollapsed)(
      `%c ${label} %c ${tag} %c ${l}`,
      `color:white;background-color:${color}`,
      `font-weight:normal;color:${tagColor}`,
      'font-weight:normal;color:reset',
    )
  })
  console.groupEnd()
}

// endregion


// region - Initialization

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

let tagColorIdx = 0

// endregion


const createLogger = (tag: string): Logger => {
  const tagColor = TAG_COLORS[tagColorIdx]
  tagColorIdx = (tagColorIdx + 1) % TAG_COLORS.length

  const error: LogFn = (headline, ...details) => void print(tag, tagColor, LogLevel.Error, headline, ...details)
  const warn: LogFn = (headline, ...details) => void print(tag, tagColor, LogLevel.Warn, headline, ...details)
  const info: LogFn = (headline, ...details) => void print(tag, tagColor, LogLevel.Info, headline, ...details)
  const debug: LogFn = (headline, ...details) => void print(tag, tagColor, LogLevel.Debug, headline, ...details)

  return { error, warn, info, debug }
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
