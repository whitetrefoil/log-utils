import type {WriteStream} from 'node:tty'
import stripAnsi from 'strip-ansi'
import timestamp from 'time-stamp'
import {describe, it, vi} from 'vitest'
import {Logger} from '~/logger.js'


it('getTimestamp', ({expect}) => {
  const logger = new Logger('test')

  const expected = timestamp('HH:mm:ss')
  const actual = logger.getTimestamp()

  expect(actual).toBe(expected)
})


describe('log', () => {
  it('normal usage', ({expect}) => {
    let printed = ''

    const mockWrite = vi.fn((data: string) => {
      printed += data
    })

    const stdout = {write: mockWrite} as unknown as WriteStream
    const logger = new Logger('test', {stdout})


    logger.info('message')
    expect(stripAnsi(printed)).toMatch(/^\[\d+:\d+:\d+\] INFO test: message\n$/u)
    printed = ''

    logger.warn('warning')
    expect(stripAnsi(printed)).toMatch(/^\[\d+:\d+:\d+\] WARN test: warning\n$/u)
    printed = ''

    logger.error('error')
    expect(stripAnsi(printed)).toMatch(/^\[\d+:\d+:\d+\] ERROR test: error\n$/u)
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
    const logger = new Logger('debug')
    logger.debug('debug')
    expect(spyOnWrite).toHaveBeenCalled()
  })

  it('disabled', ({expect}) => {
    const spyOnWrite = vi.spyOn(process.stderr, 'write')
    const logger = new Logger('debug')
    logger.debug('debug')
    expect(spyOnWrite).not.toHaveBeenCalled()
  })

  it('not match', ({expect, reloadDebug}) => {
    vi.stubEnv('DEBUG', 'asdf')
    reloadDebug()
    const spyOnWrite = vi.spyOn(process.stderr, 'write')
    const logger = new Logger('debug')
    logger.debug('debug')
    expect(spyOnWrite).not.toHaveBeenCalled()
  })
})
