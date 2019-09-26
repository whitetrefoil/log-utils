import cleanStack   from 'clean-stack';

const ERR_COLOR = 'red';
// const ERR_COLOR = 'tomato';
// const ERR_COLOR = 'firebrick';

// const WARN_COLOR = 'goldenrod';
const WARN_COLOR = 'darkgoldenrod';
// const WARN_COLOR = 'orange';

// const INFO_COLOR = 'black';
// const INFO_COLOR = 'darkgray';
// const INFO_COLOR = 'dimgray';
// const INFO_COLOR = 'gray';
const INFO_COLOR = 'slategray';

// const DEBUG_COLOR = 'blue';
// const DEBUG_COLOR = 'darkcyan';
// const DEBUG_COLOR = 'darkslateblue';
// const DEBUG_COLOR = 'dodgerblue';
const DEBUG_COLOR = 'royalblue';


const TAG_COLORS = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson',
];

export enum LogLevel {
  Quiet = 0,
  Error,
  Warn,
  Info,
  Debug,
}

declare global {
  interface Window {
    __LOG_LEVEL__: LogLevel;
    __LOG_EXPANDED__: boolean;
  }
}

const noop = () => undefined;

type LevelDef = [Function, string, string];
const LevelDefs: LevelDef[] = [
  [noop, '', ''],
  [console.error, ERR_COLOR, 'ERR'],
  [console.warn, WARN_COLOR, 'WRN'],
  [console.log, INFO_COLOR, 'INF'],
  [console.log, DEBUG_COLOR, 'DEBUG'],
];


if (window.__LOG_LEVEL__ == null) {
  window.__LOG_LEVEL__ = 3;
  window.__LOG_EXPANDED__ = false;
}


type Primitive = string|number|boolean|symbol|bigint|null|undefined;

function isPrimitive(val: any): val is Primitive {
  return typeof val !== 'object' || val === null;
}

function extractStack(err: Error): string {
  if (err.stack == null) {
    return '';
  }

  const lines = err.stack.split('\n').map(l => l.trim());
  if (lines[0] === err.toString()) {
    lines.splice(0, 1);
  }
  return lines.join('\n');
}

function format(...lines: any[]): string[] {
  const formatted: string[] = [];

  lines.forEach((l, i) => {
    if (isPrimitive(l)) {
      formatted.push(String(l));
    } else if (l instanceof Error) {
      formatted.push(String(l));
      formatted.push(cleanStack(extractStack(l)));
    } else if (l.toString !== Object.prototype.toString) {
      formatted.push(l.toString());
    } else if (i === 0) {
      formatted.push(l.name != null ? l.name : 'Complex object:');
      formatted.push(JSON.stringify(l, null, 2));
    } else {
      formatted.push(`${l.name != null ? l.name : 'Complex object:'}\n${JSON.stringify(l, null, 2)}`);
    }
  });

  return formatted;
}


let tagColorIdx = 0;


class Logger {
  private tagColor: string;

  constructor(public tag: string) {
    this.tagColor = TAG_COLORS[tagColorIdx];
    tagColorIdx = (tagColorIdx + 1) % TAG_COLORS.length;
  }

  error(headline: any, ...details: any[]): void {
    this.print(LogLevel.Error, headline, ...details);
  }

  warn(headline: any, ...details: any[]): void {
    this.print(LogLevel.Warn, headline, ...details);
  }

  info(headline: any, ...details: any[]): void {
    this.print(LogLevel.Info, headline, ...details);
  }

  debug(headline: any, ...details: any[]): void {
    this.print(LogLevel.Debug, headline, ...details);
  }

  private print(level: LogLevel, headline: any, ...details: any[]): void {
    if (window.__LOG_LEVEL__ < level) {
      return;
    }
    const def = LevelDefs[level];
    if (def == null) {
      return;
    }
    const [fn, color, label] = def;
    const formatted = format(headline, ...details);
    if (formatted.length === 0) {
      fn(
        `%c ${label} %c ${this.tag} %c <EMPTY>`,
        `color:white;background-color:${color}`,
        `font-weight:normal;color:${this.tagColor}`,
        'font-weight:normal;color:reset',
      );
      return;
    }
    if (formatted.length === 1) {
      fn(
        `%c ${label} %c ${this.tag} %c ${formatted[0]}`,
        `color:white;background-color:${color}`,
        `font-weight:normal;color:${this.tagColor}`,
        'font-weight:normal;color:reset',
      );
      return;
    }
    formatted.forEach((l, i) => {
      i === 0
        ? (window.__LOG_EXPANDED__ ? console.group : console.groupCollapsed)(
        `%c ${label} %c ${this.tag} %c ${l}`,
        `color:white;background-color:${color}`,
        `font-weight:normal;color:${this.tagColor}`,
        'font-weight:normal;color:reset',
        )
        : fn(l);
    });
    console.groupEnd();
  }
}

export function getLogger(tag: string): Logger {
  return new Logger(tag);
}
