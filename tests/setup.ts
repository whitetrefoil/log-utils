import debug from 'debug'
import {afterEach, beforeEach, vi} from 'vitest'


declare module 'vitest' {
  export interface TestContext {
    reloadDebug: () => void
  }
}


beforeEach(ctx => {
  ctx.reloadDebug = () => {
    debug.enable(process.env.DEBUG ?? '')
  }
})

afterEach(ctx => {
  vi.unstubAllEnvs()
  ctx.reloadDebug()
})
