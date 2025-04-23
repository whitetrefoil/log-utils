import getDebugger from 'debug'
import type {WriteStream} from 'node:tty'
import slash from 'slash'
import ts from 'time-stamp'
import {colors} from './colors.js'
import type {LogLevel} from './level.js'


/** 全局的标签颜色索引计数器，新的 Logger 实例会使用当时的此数值作为其标签颜色索引值，并将此计数器加一 */
let tagColorIdx = 0


interface LoggerConfig {
  /** 时间戳长度，0 为不显示，1 为只显示时间，2 为显示日期+时间 */
  timestamp?: 0|1|2
  /** 是否将标签中的路径自动转换为 Unix 格式 */
  pathConv?: boolean
  /** 标准输出流 */
  stdout?: WriteStream
}


export interface Logger {
  /** 日志标签 */
  readonly tag: string
  /** 标签颜色索引 */
  readonly idx: number
  /** 时间戳长度，0 为不显示，1 为只显示时间，2 为显示日期+时间 */
  readonly timestamp: 0|1|2
  /** 是否将标签中的路径自动转换为 Unix 格式 */
  readonly pathConv: boolean
  /** 标准输出流 */
  readonly stdout: WriteStream

  info: (...msg: unknown[]) => void
  warn: (...msg: unknown[]) => void
  error: (...msg: unknown[]) => void
  debug: (formatter: unknown, ...msg: unknown[]) => void

  /** 基于当前 Logger 的配置创建一个新的 Logger 实例 */
  getLogger: (
    tag: string,
    config: LoggerConfig,
  ) => Logger
}


export function getLogger(
  /** 日志标签 */
  tag: string,
  config: LoggerConfig = {},
): Logger {
  const {timestamp = 1, pathConv = true, stdout = process.stdout} = config

  const tagColorCount = Object.keys(colors.tag).length
  const idx = tagColorIdx%tagColorCount
  tagColorIdx = (tagColorIdx+1)%tagColorCount

  const debug = getDebugger(tag)

  const getTimestamp = (): string => {
    switch (timestamp) {
      case 0:
        return ''
      case 2:
        return ts('YYYY-MM-DD HH:mm:ss')
      case 1:
      default:
        return ts('HH:mm:ss')
    }
  }

  const getPrefix = (level: LogLevel|'debug'): string => {
    const prefixFragments: string[] = []

    const tsStr = getTimestamp()
    if (tsStr.length > 0) prefixFragments.push(colors.timestamp(`[${tsStr}]`))

    prefixFragments.push(colors[level](level.toUpperCase()))

    const tagStr = pathConv ? slash(tag) : tag
    const colorizedTag = colors.tag[idx]?.(`${tagStr}:`)
    if (colorizedTag != null) prefixFragments.push(colorizedTag)

    return `${prefixFragments.join(' ')} `
  }

  const print = (...msg: unknown[]) => {
    for (const m of msg) {
      stdout.write(String(m))
    }

    stdout.write('\n')
  }

  const info = (...msg: unknown[]) => {
    print(getPrefix('info'), ...msg)
  }

  const warn = (...msg: unknown[]) => {
    print(getPrefix('warn'), ...msg)
  }

  const error = (...msg: unknown[]) => {
    print(getPrefix('error'), ...msg)
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow -- extend itself, so the name should be same
  const extend = (tag: string, config: LoggerConfig = {}) => getLogger(tag, {timestamp, pathConv, stdout, ...config})

  return {
    tag,
    idx,
    timestamp,
    pathConv,
    stdout,
    debug,
    info,
    warn,
    error,
    getLogger: extend,
  }
}
