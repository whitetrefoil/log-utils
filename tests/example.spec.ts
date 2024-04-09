import {expect, test} from 'vitest'
import {getLogger} from '~/main.js'


test('should pass', () => {
  expect(true).toBe(true)
})

test('should be a function', () => {
  expect(typeof getLogger).toBe('function')
})
