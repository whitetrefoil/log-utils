import timestamp from 'time-stamp'
import {test} from 'vitest'
import {Logger} from '~/logger.js'


test.skip('getTimestamp', ({expect}) => {
  const logger = new Logger('test')

  const expected = timestamp('HH:mm:ss')
  // const actual = logger.getTimestamp()

  // expect(actual).toBe(expected)
})
