# Development Guide

## Naming Conventions

- Source files use lowercase kebab names (`logger.ts`, `colors.ts`).
- Function names use camelCase; exported factory functions are descriptive (`getLogger`, `setLevel`).
- Type names use PascalCase; prefer explicit types over inline object annotations.
- Internal path alias `#/*` maps to `./src/*` for imports within the project.

## API Contracts

### `getLogger(tag: string, config?: LoggerConfig)`

- Returns a tagged logger bound to `tag`.
- `config` is an optional object with:
  - `timestamp`: `0 | 1 | 2` (default `1`). `0` disables the timestamp, `1` shows time only (`HH:mm:ss`), `2` shows date + time (`YYYY-MM-DD HH:mm:ss`).
  - `pathConv`: `boolean` (default `true`). When `true`, the tag is passed through `slash` to normalize path separators to Unix style.
  - `logFn`: `(...msg: unknown[]) => void` (default `console.log`). Function used to emit formatted messages for `info`, `warn`, and `error`.
- Returned logger exposes `error`, `warn`, `info`, and `debug` methods. `debug` delegates to the underlying `debug` instance for the tag, so its namespace filtering is controlled by the `DEBUG` environment variable, not by this library.
- The returned logger also exposes `getLogger(tag, config?)`, which creates a child logger inheriting the parent's `timestamp`, `pathConv`, and `logFn` unless overridden by `config`.

### `LogLevel`, `logLevels`, `isLogLevel`

- `LogLevel` is the type union `'info' | 'warn' | 'error'`.
- `logLevels` is the readonly tuple `['info', 'warn', 'error'] as const`.
- `isLogLevel(value: unknown): value is LogLevel` is a type guard. It does **not** gate console output; it is exported only as a type utility for consumers that want to validate level strings. The library itself performs no global log-level filtering.

### `colors` / `Colorify`

- `colors` is a `Colorify` instance with color helpers for `timestamp`, `error`, `warn`, `info`, `debug`, and a 6-entry `tag` tuple used for tag color cycling.
- `Colorify` is the corresponding type, exported for consumers that want to build compatible color objects.

## ESLint Constraints

- Base config: `@whitetrefoil/eslint-config` with `type: 'web'` and TypeScript root dir set to `import.meta.dirname`.
- `no-console` is explicitly disabled: this library's entire purpose is console output.
- All other rules from the shared config remain active.

## State Management

- The only mutable state in `src/logger.ts` is the module-level `tagColorIdx` counter used to cycle tag colors across `getLogger` calls.
- There is no global log-level state; `LogLevel`/`logLevels`/`isLogLevel` in `src/level.ts` are pure type utilities and do not gate output.
- Keep state minimal; avoid introducing per-logger state that could diverge from the public contract.

## Component / Module Boundaries

- `main.ts`: only public exports; no implementation details.
- `logger.ts`: logger construction, prefix formatting, and method binding.
- `level.ts`: `LogLevel` type, `logLevels` tuple, and `isLogLevel` type guard. No runtime filtering.
- `colors.ts`: formatting helpers; no business logic.

## Git Workflow

- Commit messages must be in **English** per the project language convention.
- Update the knowledge map in the same commit batch as code changes.

## Performance Notes (Summary)

- Keep helpers stateless.
- The library does not perform log-level filtering, so there is no "avoid formatting when filtered" optimization to apply; the only gating is the `debug` package's `DEBUG` namespace matching for the `debug` method.

## Security Notes (Summary)

- Do not log raw environment variables or secrets.
- Treat externally supplied tags as untrusted strings; sanitization should happen before they reach `getLogger`.
- Use `strip-ansi` when stripping color codes from untrusted output.
