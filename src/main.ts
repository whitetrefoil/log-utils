// tslint:disable:ban-ts-ignore

export let LogLevel: typeof import('./dev').LogLevel;
let getLogger: typeof import('./dev').getLogger;

try {
// @ts-ignore
  if (process.env.NODE_ENV === 'development') {
    // @ts-ignore
    LogLevel = require('./dev').LogLevel;
    // @ts-ignore
    getLogger = require('./dev').getLogger;
  } else {
    // @ts-ignore
    LogLevel = require('./prod').LogLevel;
    // @ts-ignore
    getLogger = require('./prod').getLogger;
  }
} catch (e) {
  // @ts-ignore
  LogLevel = require('./prod').LogLevel;
  // @ts-ignore
  getLogger = require('./prod').getLogger;
}

export default getLogger;
