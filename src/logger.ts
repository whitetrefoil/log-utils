import type {Debugger} from 'debug'
import debug from 'debug'
import type {WriteStream} from 'node:tty'
import slash from 'slash'
import timestamp from 'time-stamp'
import {colors} from './colors.js'
import type {LogLevel} from './level.js'


/** 全局的标签颜色索引计数器，新的 Logger 实例会使用当时的此数值作为其标签颜色索引值，并将此计数器加一 */
let tagColorIdx = 0


export class Logger {
  /** 日志标签 */
  readonly tag: string
  /** 标签颜色索引 */
  idx: number
  /** 日志等级 */
  level: LogLevel|undefined
  /** 时间戳长度，0 为不显示，1 为只显示时间，2 为显示日期+时间 */
  readonly timestamp: 0|1|2
  /** 是否将标签中的路径自动转换为 Unix 格式 */
  readonly pathConv: boolean
  /** 标准输出流 */
  readonly stdout: WriteStream

  #debugger: Debugger


  constructor(
    tag: string,
    config: {
      /** 时间戳长度，0 为不显示，1 为只显示时间，2 为显示日期+时间 */
      timestamp?: 0|1|2
      /** 是否将标签中的路径自动转换为 Unix 格式 */
      pathConv?: boolean
      /** 标准输出流 */
      stdout?: WriteStream
    } = {},
  ) {
    this.tag = tag
    this.timestamp = config.timestamp ?? 1
    this.pathConv = config.pathConv ?? true
    this.stdout = config.stdout ?? process.stdout

    const tagColorCount = Object.keys(colors.tag).length
    this.idx = tagColorIdx%tagColorCount
    tagColorIdx = (tagColorIdx+1)%tagColorCount

    this.#debugger = debug(tag)
  }

  getTimestamp(): string {
    switch (this.timestamp) {
      case 0:
        return ''
      case 2:
        return timestamp('YYYY-MM-DD HH:mm:ss')
      case 1:
      default:
        return timestamp('HH:mm:ss')
    }
  }

  getPrefix(level: LogLevel|'debug'): string {
    const prefixFragments: string[] = []

    const ts = this.getTimestamp()
    if (timestamp.length > 0) prefixFragments.push(colors.timestamp(`[${ts}]`))

    prefixFragments.push(colors[level](level.toUpperCase()))

    const tag = this.pathConv ? slash(this.tag) : this.tag
    const colorizedTag = colors.tag[this.idx]?.(`${tag}:`)
    if (colorizedTag != null) prefixFragments.push(colorizedTag)

    return `${prefixFragments.join(' ')} `
  }

  print(...msg: unknown[]) {
    for (const m of msg) {
      this.stdout.write(String(m))
    }

    this.stdout.write('\n')
  }

  info(...msg: unknown[]) {
    this.print(this.getPrefix('info'), ...msg)
  }

  warn(...msg: unknown[]) {
    this.print(this.getPrefix('warn'), ...msg)
  }

  error(...msg: unknown[]) {
    this.print(this.getPrefix('error'), ...msg)
  }

  debug(formatter: unknown, ...msg: unknown[]) {
    this.#debugger(formatter, ...msg)
  }

  /** 基于当前 Logger 的配置创建一个新的 Logger 实例 */
  getLogger(
    tag: string,
    config: {
      /**
       * 日志等级，如果不设置，则使用全局配置的日志等级
       * @default undefined
       */
      level?: LogLevel|undefined
      /** 时间戳长度，0 为不显示，1 为只显示时间，2 为显示日期+时间 */
      timestamp?: 0|1|2
      /** 是否将标签中的路径自动转换为 Unix 格式 */
      pathConv?: boolean
      /** 标准输出流 */
      stdout?: WriteStream
    } = {},
  ) {
    return new Logger(tag, {
      timestamp: this.timestamp,
      pathConv : this.pathConv,
      stdout   : this.stdout,
      ...config,
    })
  }
}


export function getLogger(
  tag: string,
  config: {
    /** 时间戳长度，0 为不显示，1 为只显示时间，2 为显示日期+时间 */
    timestamp?: 0|1|2
    /** 是否将标签中的路径自动转换为 Unix 格式 */
    pathConv?: boolean
    /** 标准输出流 */
    stdout?: WriteStream
  } = {},
) {
  return new Logger(tag, config)
}
