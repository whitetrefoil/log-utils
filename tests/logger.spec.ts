import stripAnsi from 'strip-ansi'
import {describe, it, vi} from 'vitest'
import {getLogger} from '~/logger.js'


describe('log', () => {
  it('normal usage', ({expect}) => {
    let printed = ''

    const mockWrite = vi.fn((data: string) => {
      printed += data
    })

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

    logger.debug('debug')
    mockWrite.mockRestore()
    expect(mockWrite).not.toHaveBeenCalled()
    expect(printed).toBe('')
    printed = ''

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
