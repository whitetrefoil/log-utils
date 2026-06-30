# Development Guide

## Naming Conventions

- Source files use lowercase kebab names (`logger.ts`, `colors.ts`).
- Function names use camelCase; exported factory functions are descriptive (`getLogger`, `setLevel`).
- Type names use PascalCase; prefer explicit types over inline object annotations.
- Internal path alias `#/*` maps to `./src/*` for imports within the project.

## API Contracts

### `getLogger(tag: string, disableNormalization?: boolean)`

- Returns a tagged logger bound to `tag`.
- By default, treats `tag` as a path and normalizes path separators for Windows compatibility.
- Pass `disableNormalization = true` to skip normalization (e.g., when the tag is not a path).
- Returned logger exposes `error`, `warn`, `info`, and `debug` methods.

### `setLevel(level: LogLevel)`

- Sets the maximum log level globally.
- Valid levels correspond to the logger methods: `error`, `warn`, `info`, `debug`.
- Does not affect `debug`-package namespace filtering; it only gates the console output.

### Re-exports from `debug`

- The package re-exports `debug` so consumers can use the same tagged namespace mechanism.

## ESLint Constraints

- Base config: `@whitetrefoil/eslint-config` with `type: 'web'` and TypeScript root dir set to `import.meta.dirname`.
- `no-console` is explicitly disabled: this library's entire purpose is console output.
- All other rules from the shared config remain active.

## State Management

- Log level is global mutable state in `src/level.ts`.
- Keep it minimal; avoid introducing per-logger state that could diverge from the global level.

## Component / Module Boundaries

- `main.ts`: only public exports; no implementation details.
- `logger.ts`: logger construction and method binding.
- `level.ts`: level constants and global level setter/getter.
- `colors.ts`: formatting helpers; no business logic.

## Git Workflow

- Commit messages must be in **English** per the project language convention.
- Update the knowledge map in the same commit batch as code changes.

## Performance Notes (Summary)

- Keep helpers stateless.
- Avoid eager formatting when a message will be filtered out by the current log level.

## Security Notes (Summary)

- Do not log raw environment variables or secrets.
- Treat externally supplied tags as untrusted strings; sanitization should happen before they reach `getLogger`.
- Use `strip-ansi` when stripping color codes from untrusted output.
