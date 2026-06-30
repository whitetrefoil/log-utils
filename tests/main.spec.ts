import {describe, expect, it} from 'vitest'
import * as mainApi from '#/main.js'


describe('main entry exports', () => {
  it('exports getLogger as a function', () => {
    expect(typeof mainApi.getLogger).toBe('function')
  })

  it('exports isLogLevel as a function', () => {
    expect(typeof mainApi.isLogLevel).toBe('function')
  })

  it('exports colors object', () => {
    expect(typeof mainApi.colors).toBe('object')
    expect(mainApi.colors).not.toBeNull()
  })

  it('exports logLevels as array with 3 entries', () => {
    expect(Array.isArray(mainApi.logLevels)).toBe(true)
    expect(mainApi.logLevels).toHaveLength(3)
  })
})
