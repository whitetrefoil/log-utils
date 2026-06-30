# Performance Guide

## Build Optimization

- The project uses `tsc` directly instead of a bundler, so build time is already minimal.
- `yarn build` removes `lib/` before emit; keep `lib/` out of source control and long-running tooling paths.
- Type declaration emit is enabled; ensure `src/tsconfig.json` exclusions keep test files out of `lib/`.

## Runtime Optimization

- Keep formatting helpers in `src/colors.ts` stateless and side-effect free.
- Avoid formatting log messages when the current global level would discard them.
- The library delegates tag filtering to the `debug` package; do not re-implement its namespace logic.

## Resource Optimization

- Runtime dependencies are kept small (`chalk`, `debug`, `slash`, `strip-ansi`, `supports-color`, `time-stamp`).
- Do not add heavy runtime dependencies for cosmetic features.

## Monitoring and Metrics

- No runtime telemetry is implemented.
- If adding benchmarks, document the harness and baseline in this file.

## Forbidden Optimizations

- Do not suppress TypeScript strictness to speed up builds.
- Do not introduce a bundler unless the package surface genuinely requires it.
- Do not cache mutable log-level state inside individual loggers.
