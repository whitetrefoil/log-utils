import {describe, expect, it} from 'vitest'
import {isLogLevel, logLevels} from '#/level.js'


describe('logLevels', () => {
  it('contains info, warn, error in order', () => {
    expect(logLevels).toEqual(['info', 'warn', 'error'])
  })

  it('has exactly 3 entries', () => {
    expect(logLevels).toHaveLength(3)
  })
})

describe('isLogLevel', () => {
  it('accepts info', () => {
    expect(isLogLevel('info')).toBe(true)
  })

  it('accepts warn', () => {
    expect(isLogLevel('warn')).toBe(true)
  })

  it('accepts error', () => {
    expect(isLogLevel('error')).toBe(true)
  })

  it('rejects debug', () => {
    expect(isLogLevel('debug')).toBe(false)
  })

  it('rejects arbitrary string', () => {
    expect(isLogLevel('verbose')).toBe(false)
  })

  it('rejects non-string values', () => {
    expect(isLogLevel(42)).toBe(false)
    expect(isLogLevel(null)).toBe(false)
    expect(isLogLevel(undefined)).toBe(false)
    expect(isLogLevel({})).toBe(false)
  })
})
