import {expect, test} from 'vitest'
import {getLogger, setLevel} from '~/main.js'


test('should pass', () => {
  expect(true).toBe(true)
})

test('should be a function', () => {
  expect(typeof getLogger).toBe('function')
})

test('print', () => {
  setLevel('debug')
  const logger = getLogger('test')
  logger.error('error')
  logger.warn('test')
  logger.info('info')
  logger.debug('debug')
})
