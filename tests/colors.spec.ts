import stripAnsi from 'strip-ansi'
import {describe, expect, it} from 'vitest'
import {colors} from '#/colors.js'


describe('colors', () => {
  it('exposes timestamp, error, warn, info, debug functions', () => {
    expect(typeof colors.timestamp).toBe('function')
    expect(typeof colors.error).toBe('function')
    expect(typeof colors.warn).toBe('function')
    expect(typeof colors.info).toBe('function')
    expect(typeof colors.debug).toBe('function')
  })

  it('has a tag tuple of 6 color functions', () => {
    expect(Array.isArray(colors.tag)).toBe(true)
    expect(colors.tag).toHaveLength(6)

    for (const fn of colors.tag) {
      expect(typeof fn).toBe('function')
    }
  })

  it('level helpers return strings', () => {
    expect(typeof colors.timestamp('x')).toBe('string')
    expect(typeof colors.error('x')).toBe('string')
    expect(typeof colors.warn('x')).toBe('string')
    expect(typeof colors.info('x')).toBe('string')
    expect(typeof colors.debug('x')).toBe('string')
  })

  it('tag color functions return strings', () => {
    for (const fn of colors.tag) {
      expect(typeof fn('x')).toBe('string')
    }
  })

  it('level helpers preserve original text content after stripping ANSI', () => {
    // 颜色函数应保留原始文本，仅包裹 ANSI 转义
    expect(stripAnsi(colors.timestamp('hello'))).toBe('hello')
    expect(stripAnsi(colors.error('hello'))).toBe('hello')
    expect(stripAnsi(colors.warn('hello'))).toBe('hello')
    expect(stripAnsi(colors.info('hello'))).toBe('hello')
    expect(stripAnsi(colors.debug('hello'))).toBe('hello')
  })

  it('tag color functions preserve original text content after stripping ANSI', () => {
    for (const fn of colors.tag) {
      expect(stripAnsi(fn('hello'))).toBe('hello')
    }
  })
})
