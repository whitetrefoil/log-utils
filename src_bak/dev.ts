/* eslint-disable no-console */

import cleanStack    from 'clean-stack'
import { bind }      from 'decko'
import slash         from 'slash'
import { Primitive } from 'utility-types'

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

export enum LogLevel {
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
    __LOG_LEVEL__: LogLevel
    __LOG_EXPANDED__: boolean
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


function isPrimitive(val: unknown): val is Primitive {
  return typeof val !== 'object' || val === null
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


class Logger {
  readonly #tagColor: string

  constructor(public tag: string) {
    this.#tagColor = TAG_COLORS[tagColorIdx]
    tagColorIdx = (tagColorIdx + 1) % TAG_COLORS.length
  }

  @bind
  error(headline: unknown, ...details: unknown[]): void {
    this.print(LogLevel.Error, headline, ...details)
  }

  @bind
  warn(headline: unknown, ...details: unknown[]): void {
    this.print(LogLevel.Warn, headline, ...details)
  }

  @bind
  info(headline: unknown, ...details: unknown[]): void {
    this.print(LogLevel.Info, headline, ...details)
  }

  @bind
  debug(headline: unknown, ...details: unknown[]): void {
    this.print(LogLevel.Debug, headline, ...details)
  }

  @bind
  private print(level: LogLevel, headline: unknown, ...details: unknown[]): void {
    if (window.__LOG_LEVEL__ < level) {
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
        `%c ${label} %c ${this.tag} %c <EMPTY>`,
        `color:white;background-color:${color}`,
        `font-weight:normal;color:${this.#tagColor}`,
        'font-weight:normal;color:reset',
      )
      return
    }
    if (formatted.length === 1) {
      fn(
        `%c ${label} %c ${this.tag} %c ${formatted[0]}`,
        `color:white;background-color:${color}`,
        `font-weight:normal;color:${this.#tagColor}`,
        'font-weight:normal;color:reset',
      )
      return
    }
    formatted.forEach((l, i) => {
      i === 0
        ? (window.__LOG_EXPANDED__ ? console.group : console.groupCollapsed)(
        `%c ${label} %c ${this.tag} %c ${l}`,
        `color:white;background-color:${color}`,
        `font-weight:normal;color:${this.#tagColor}`,
        'font-weight:normal;color:reset',
        )
        : fn(l)
    })
    console.groupEnd()
  }
}

/**
 * @param tag - Tag in console
 * @param noPathConv - Convert path sep to slash
 */
export function getLogger(tag: string, noPathConv = false): Logger {
  if (noPathConv === true) {
    return new Logger(tag)
  }
  const posixTag = slash(tag)
  return new Logger(posixTag)
}
