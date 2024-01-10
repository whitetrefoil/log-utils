Log Utils (@whitetrefoil/log-utils)
==================================================

Some browser console.log utilities inspired by debug.

Important
---------

This package is an ESM, cannot be used directly as a CJS module.

Usage
-----

```typescript
import { getLogger, LogLevel } from '@whitetrefoil/log-utils';

// Optional max level, default is LOG
window.__LOG_LEVEL__ = LogLevel.Debug;

// Optional, console.group OR console.groupCollapsed, default is collapsed
window.__LOG_EXPANDED__ = true;

// Give any tag like debug, personally I'd like to use the file path.
const logger = getLogger(`/src/${__filename.split('?')[0]}`);

logger.error(/*...*/);
logger.warn(/*...*/);
logger.info(/*...*/);
logger.debug(/*...*/);

// `getLogger` has a optional second argument, set to true to disable path sep normalization.
const logger = getLogger(`i'm not a path \ don't touch the backslash`, true);
```

Changelog & Roadmap
-------------------

### v0.8.0

* Upgrade to node 20 & latest infrastructure.

### v0.7.1

* Upgrade to typescript 3.7 & built to a real ESM.

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

* Assume the log tag is a path, enables auto path sep normalization for windows by default.

### v0.2.1

* Fix `Cannot read property 'print' of undefined` (by binding methods to class).

### v0.2.0

* Also export `getLogger` besides default.

### v0.1.1

* Fix build config.

### v0.1.0

* Initial release.
