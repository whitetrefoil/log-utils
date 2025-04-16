// see: https://github.com/jonschlinkert/time-stamp/issues/14

declare module 'time-stamp' {
  function timestamp(pattern?: string | Date, date?: Date): string
  function timestampUTC(pattern?: string | Date, date?: Date): string

  export {timestampUTC as utc}
  export = timestamp
}
