Unistore Hooks (@whitetrefoil/unistore-hooks)
==================================================

Some browser console.log utilities inspired by debug.

Important
---------

If your code isn't targeting the latest syntax spec of JS / ES,
please use something like babel to transfer this library.

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

```

Changelog & Roadmap
-------------------

### v0.1.0

* Initial release.
