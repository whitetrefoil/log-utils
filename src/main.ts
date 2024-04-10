import * as loglevel from 'loglevel'
import * as prefixPlugin from 'loglevel-plugin-prefix'
import slash from 'slash'
import {colors} from './colors.js'


export type {LogLevelDesc, LogLevelNumbers, LogLevelNames, LogLevel} from 'loglevel'


export interface SubLogger {
  error: (...msg: any[]) => void
  warn: (...msg: any[]) => void
  info: (...msg: any[]) => void
  debug: (...msg: any[]) => void
  getLogger: (tag: string, noPathConv?: boolean) => SubLogger
}


let tagColorIdx = 0

prefixPlugin.reg(loglevel)

export function getLogger(tag: string, noPathConv = false): SubLogger {
  const tagColorCount = Object.keys(colors.tag).length
  const idx = tagColorIdx%tagColorCount
  tagColorIdx += 1

  const logger = loglevel.getLogger(noPathConv ? tag : slash(tag))
  prefixPlugin.apply(logger, {
    levelFormatter: lv => lv.toUpperCase(),

    format: (level, name, timestamp) => {
      // @ts-expect-error - Official typing bug: https://github.com/kutuluk/loglevel-plugin-prefix/issues/17
      const ts = timestamp as string
      switch (level) {
        case 'ERROR':
          return `${colors.timestamp(`[${ts}]`)} ${colors.error(level)} ${colors.tag[idx]?.(`${name}:`)}`
        case 'WARN':
          return `${colors.timestamp(`[${ts}]`)} ${colors.warn(level)} ${colors.tag[idx]?.(`${name}:`)}`
        case 'INFO':
          return `${colors.timestamp(`[${ts}]`)} ${colors.info(level)} ${colors.tag[idx]?.(`${name}:`)}`
        case 'DEBUG':
          return `${colors.timestamp(`[${ts}]`)} ${colors.debug(level)} ${colors.tag[idx]?.(`${name}:`)}`
      }
      return undefined
    },
  })

  return {
    error    : logger.error.bind(logger),
    warn     : logger.warn.bind(logger),
    info     : logger.info.bind(logger),
    debug    : logger.debug.bind(logger),
    getLogger: (_tag: string, _noPathConv = noPathConv) => getLogger(`${tag}:${_tag}`, _noPathConv),
  }
}

export function getLevel() {
  return loglevel.getLevel()
}

export function setLevel(level: 'error'|'warn'|'info'|'debug', persist?: boolean) {
  loglevel.setLevel(level, persist)
  loglevel.rebuild()
}
