import {expectTypeOf, test} from 'vitest'
import main from '~/main.js'


test('example types', () => {
  expectTypeOf(main).toEqualTypeOf<() => void>()
})
