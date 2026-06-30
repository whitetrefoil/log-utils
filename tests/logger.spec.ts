import stripAnsi from 'strip-ansi'
import {describe, it, vi} from 'vitest'
import {getLogger} from '#/logger.js'


describe('log', () => {
  it('normal usage', ({expect}) => {
    let printed = ''

    const logFn = vi.fn((...msg: unknown[]) => {
      printed += msg.join('')
    })

    const logger = getLogger('test', {logFn})

    logger.info('message')
    expect(stripAnsi(printed)).toMatch(/^\[\d+:\d+:\d+\] INFO test: message$/u)
    printed = ''

    logger.warn('warning')
    expect(stripAnsi(printed)).toMatch(/^\[\d+:\d+:\d+\] WARN test: warning$/u)
    printed = ''

    logger.error('error')
    expect(stripAnsi(printed)).toMatch(/^\[\d+:\d+:\d+\] ERROR test: error$/u)
    printed = ''
  })

  it('timestamp disabled (timestamp: 0)', ({expect}) => {
    let printed = ''

    const logger = getLogger('nots', {
      timestamp : 0,
      logFn     : (...msg: unknown[]) => {printed += msg.join('')},
    })

    logger.info('plain')
    expect(stripAnsi(printed)).toBe('INFO nots: plain')
  })

  it('timestamp with date (timestamp: 2)', ({expect}) => {
    let printed = ''

    const logger = getLogger('dts', {
      timestamp : 2,
      logFn     : (...msg: unknown[]) => {printed += msg.join('')},
    })

    logger.info('dated')
    expect(stripAnsi(printed)).toMatch(/^\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\] INFO dts: dated$/u)
  })

  it('pathConv disabled keeps backslash', ({expect}) => {
    let printed = ''
    const tag = 'win\\path'

    const logger = getLogger(tag, {
      pathConv : false,
      timestamp: 0,
      logFn    : (...msg: unknown[]) => {printed += msg.join('')},
    })

    logger.info('raw')
    expect(stripAnsi(printed)).toBe('INFO win\\path: raw')
  })

  it('pathConv enabled converts backslash to slash', ({expect}) => {
    let printed = ''
    const tag = 'win\\path'

    const logger = getLogger(tag, {
      pathConv : true,
      timestamp: 0,
      logFn    : (...msg: unknown[]) => {printed += msg.join('')},
    })

    logger.info('conv')
    expect(stripAnsi(printed)).toBe('INFO win/path: conv')
  })

  it('child logger inherits parent config when omitted', ({expect}) => {
    let printed = ''

    const parent = getLogger('parent', {
      timestamp : 0,
      pathConv  : false,
      logFn     : (...msg: unknown[]) => {printed += msg.join('')},
    })

    const child = parent.getLogger('child\\sub')
    child.info('inherited')
    // 父 logger 的 pathConv: false 应被继承，反斜杠保留
    expect(stripAnsi(printed)).toBe('INFO child\\sub: inherited')
  })

  it('child logger overrides parent config', ({expect}) => {
    let printed = ''

    const parent = getLogger('parent', {
      timestamp : 0,
      pathConv  : false,
      logFn     : (...msg: unknown[]) => {printed += msg.join('')},
    })

    const child = parent.getLogger('child\\sub', {pathConv: true})
    child.info('overridden')
    // 子 logger 显式覆盖 pathConv: true，反斜杠应被转换
    expect(stripAnsi(printed)).toBe('INFO child/sub: overridden')
  })

  it('logFn override receives prefix and message', ({expect}) => {
    const received: unknown[][] = []

    const logger = getLogger('fn', {
      timestamp : 0,
      logFn     : (...msg: unknown[]) => {received.push(msg)},
    })

    logger.info('a', 'b')
    expect(received).toHaveLength(1)
    expect(stripAnsi(String(received[0]![0]))).toBe('INFO fn: ')
    expect(received[0]![1]).toBe('a')
    expect(received[0]![2]).toBe('b')
  })
})

describe('debug', () => {
  it('enabled', ({expect, reloadDebug}) => {
    vi.stubEnv('DEBUG', '*')
    reloadDebug()
    const spyOnWrite = vi.spyOn(process.stderr, 'write')
    const logger = getLogger('debug')
    logger.debug('debug')
    expect(spyOnWrite).toHaveBeenCalled()
  })

  it('disabled', ({expect}) => {
    const spyOnWrite = vi.spyOn(process.stderr, 'write')
    const logger = getLogger('debug')
    logger.debug('debug')
    expect(spyOnWrite).not.toHaveBeenCalled()
  })

  it('not match', ({expect, reloadDebug}) => {
    vi.stubEnv('DEBUG', 'asdf')
    reloadDebug()
    const spyOnWrite = vi.spyOn(process.stderr, 'write')
    const logger = getLogger('debug')
    logger.debug('debug')
    expect(spyOnWrite).not.toHaveBeenCalled()
  })
})
