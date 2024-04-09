import {Chalk} from 'chalk'


export interface Colorify {
  timestamp: (text: string) => string
  error: (text: string) => string
  warn: (text: string) => string
  info: (text: string) => string
  debug: (text: string) => string
  tag: [
    (text: string) => string,
    (text: string) => string,
    (text: string) => string,
    (text: string) => string,
    (text: string) => string,
    (text: string) => string,
  ]
}


const isBrowser = typeof window !== 'undefined'

const chalk = new Chalk()


export const colors: Colorify = {
  timestamp: text => !isBrowser ? chalk.gray(text) : chalk.hex('#778899')(text), // LightSlateGray
  error    : text => !isBrowser ? chalk.red(text) : chalk.hex('#FF4500')(text), // OrangeRed
  warn     : text => !isBrowser ? chalk.yellow(text) : chalk.hex('#B8860B')(text), // DarkGoldenRod
  info     : text => !isBrowser ? chalk.blue(text) : chalk.hex('#4169E1')(text), // RoyalBlue
  debug    : text => !isBrowser ? chalk.cyan(text) : chalk.hex('#40E0D0')(text), // Turquoise
  tag      : [
    text => chalk.level < 3 ? chalk.cyan(text) : chalk.hex('#4682B4')(text), // SteelBlue
    text => chalk.level < 3 ? chalk.magenta(text) : chalk.hex('#228B22')(text), // ForestGreen
    text => chalk.level < 3 ? chalk.green(text) : chalk.hex('#DAA520')(text), // GoldenRod
    text => chalk.level < 3 ? chalk.gray(text) : chalk.hex('#1E90FF')(text), // DodgerBlue
    text => chalk.level < 3 ? chalk.white(text) : chalk.hex('#9932CC')(text), // DarkOrchid
    text => chalk.level < 3 ? chalk.black(text) : chalk.hex('#DC143C')(text), // Crimson
  ],
}
