Log Utils (@whitetrefoil/log-utils)
==================================================

A small ESM logging utility built on top of [`debug`](https://www.npmjs.com/package/debug) and `console.log`.

Important
---------

This package is **ESM only** and requires **Node.js `>= 24`**. It cannot be used directly as a CommonJS module.

Installation
------------

```bash
yarn add @whitetrefoil/log-utils
```

Usage
-----

```typescript
import { getLogger } from '@whitetrefoil/log-utils';

const logger = getLogger('my-tag');

logger.error('Something went wrong');
logger.warn('This is a warning');
logger.info('Hello world');

// `logger.debug` is the underlying `debug` instance
logger.debug('Formatted %s', 'message');
```

By default the tag is treated as a path and normalized to Unix-style separators. Use `pathConv: false` to keep the tag as-is:

```typescript
const logger = getLogger(`i'm not a path \ don't touch the backslash`, { pathConv: false });
```

Logger Configuration
--------------------

`getLogger(tag, config?)` accepts an optional config object:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `timestamp` | `0 \| 1 \| 2` | `1` | Timestamp length. `0` = none, `1` = time only, `2` = date + time. |
| `pathConv` | `boolean` | `true` | Normalize tag path separators to Unix style. |
| `logFn` | `(...msg: unknown[]) => void` | `console.log` | Function used to emit formatted messages. |

Extending a Logger
------------------

Each logger has a `getLogger` method that creates a child logger inheriting the parent's config:

```typescript
const parent = getLogger('parent', { timestamp: 2 });
const child = parent.getLogger('child'); // inherits timestamp: 2
```

Public API
----------

```typescript
export type { Colorify } from '@whitetrefoil/log-utils';
export { colors } from '@whitetrefoil/log-utils';

export type { LogLevel } from '@whitetrefoil/log-utils';
export { logLevels, isLogLevel } from '@whitetrefoil/log-utils';

export type { Logger } from '@whitetrefoil/log-utils';
export { getLogger } from '@whitetrefoil/log-utils';
```

- `Colorify` — type of the color helpers object.
- `colors` — color helpers for timestamp, levels, and tag colors.
- `LogLevel` — `'info' \| 'warn' \| 'error'`.
- `logLevels` — array of valid log levels.
- `isLogLevel(value)` — type guard for `LogLevel`.
- `Logger` — interface returned by `getLogger`.
- `getLogger(tag, config?)` — creates a tagged logger.

Changelog & Roadmap
-------------------

### v0.14.0

* Use `console.log` to be compatible with both Node and browser.

### v0.13.0

* Replace class with function to resolve binding issue.

### v0.12.0

* Remove log level filter.
* Re-export `debug` package instead of re-implementing it.

### v0.11.0

* New infrastructure.
* New interface.

### v0.9.0

* Upgrade infrastructure.

### v0.8.0

* Upgrade to Node 20 & latest infrastructure.

### v0.7.1

* Upgrade to TypeScript 3.7 & built to a real ESM.

### v0.6.0

* Upgrade infrastructure to support native ESM.

### v0.5.1

* Fix missing `flags.d.ts` in lib dir.

### v0.5.0

* Remove `extract-stack` & `clean-stack` for Firefox compatibility issue.
* Update dependencies.

### v0.4.1

* Fix README.
* Update dependencies.

### v0.4.0

* Don't use `JSON.stringify` when printing.

### v0.3.3

* Fix crash when `window` is not defined.

### v0.3.2 / v0.2.2

* Upgrade infrastructure.

### v0.3.1

* Fix missing LogLevel export.

### v0.3.0

* Assume the log tag is a path, enables auto path sep normalization for Windows by default.

### v0.2.1

* Fix `Cannot read property 'print' of undefined` (by binding methods to class).

### v0.2.0

* Also export `getLogger` besides default.

### v0.1.1

* Fix build config.

### v0.1.0

* Initial release.
