# Testing Guide

## Test Framework

- **Vitest** `^4.1.9` is the test runner and assertion library.
- TypeScript type checking is enabled in tests via `typecheck.enabled: true`.
- ESLint runs after the Vitest suite as part of `yarn test`.

## Test Environment

- Root directory: project root.
- Setup file: `tests/setup.ts`.
- Mocks are restored automatically (`restoreMocks: true`).
- Environment variables are unstubbed after each test (`unstubEnvs: true`).

## Writing Tests

- Test files live in `tests/` and mirror the structure of `src/`.
- Use `*.spec.ts` naming.
- Current test files: `logger.spec.ts`, `level.spec.ts`, `colors.spec.ts`, `main.spec.ts`.
- Keep tests deterministic; avoid relying on real `console.log` side effects unless explicitly testing output.
- Prefer mocking `logFn` (via the `LoggerConfig` option) when verifying output behavior.

## Coverage

- Coverage is enabled by default.
- Included paths: `src/**/*.{ts,tsx}`.
- Excluded paths: `src/stubapi/**`, `src/**/*.{test,spec}.{ts,tsx}`.
- Reports are written to `test_results/vitest/`.
- Reporters: `text`, `html-spa`, and `clover` (`clover.xml`).

## Running Tests

| Command | Purpose |
| --- | --- |
| `yarn test` | Full test run + ESLint |
| `npx vitest run` | Tests only |
| `npx vitest` | Watch mode |

## Performance Tests

- This package has no runtime performance benchmarks.
- If adding benchmarks, place them under `tests/` or a new `benchmarks/` directory and document the runner in this file.

## Security Tests

- Verify that untrusted tags cannot produce unexpected ANSI sequences or break formatting.
- Verify that `disableNormalization` behaves correctly for non-path tags.
