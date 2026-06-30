# System Architecture

## Tech Stack

This is a TypeScript ESM utility package compiled directly by `tsc` (no bundler).

| Concern | Choice | Notes |
| --- | --- | --- |
| Runtime target | Node.js `>= 24` | Native ESM only |
| Module system | ESM / `NodeNext` | `"type": "module"` in `package.json` |
| Build | TypeScript compiler | `tsc -p src/tsconfig.json` emits `lib/` |
| Test | Vitest `^4.1.9` | Coverage via `@vitest/coverage-v8` |
| Lint | ESLint `^10.6.0` | `@whitetrefoil/eslint-config` |
| Package manager | Yarn Berry `4.17.0` | `yarn.lock` checked in |

## Build Flow

1. Source lives in `src/`.
2. `src/tsconfig.json` extends the root config, enables declarations, and emits to `../lib`.
3. Test files (`**/*.spec.*`, `**/*.test.*`) are excluded from the emit.
4. `package.json` points consumers to `lib/main.js` via `"exports": { ".": "./lib/main.js" }`.

## Top-Level Modules and Boundaries

| Module | Responsibility | Exposed via |
| --- | --- | --- |
| `src/main.ts` | Public API entry point | `lib/main.js` package export |
| `src/logger.ts` | Tagged logger factory and log method binding | `getLogger(tag, disableNormalization?)` |
| `src/level.ts` | Global log-level threshold management | `setLevel(level)` |
| `src/colors.ts` | Color/format helpers for terminal and browser output | Internal helpers only |

The library wraps `debug` for tag-based filtering and uses `console.log` directly for cross-runtime compatibility.

## CodeGraph Query Entry

Because this project uses the **CodeGraph preset**, use the following queries instead of duplicating code facts into Markdown:

- Understand the public API surface:  
  `codegraph explore "getLogger setLevel main.ts"`
- Inspect a specific module:  
  `codegraph node "src/logger.ts"`
- Find callers of a helper:  
  `codegraph_callers "<symbol-name>"`

## Security Architecture

- Log tags are treated as potentially path-like strings; default behavior normalizes path separators.
- ANSI sequences are managed via `strip-ansi` and `supports-color`.
- No network or filesystem I/O is performed by the library itself.

## Performance Architecture

- No bundling step keeps build time minimal.
- Runtime cost is dominated by the underlying `debug` package and `console.log`.
- Keep helper logic in `colors.ts` stateless and side-effect free.

## Build and Deployment

- `yarn build` cleans `lib/` and compiles `src/`.
- `yarn prepack` runs `yarn build` before publishing.
- Publishing is restricted to Yarn (`"prepare"` script blocks NPM).
