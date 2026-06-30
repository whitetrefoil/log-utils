# Security Guide

## Authentication

- Not applicable: this is a logging utility with no authentication flows.

## Input Sanitization

- Treat externally supplied log tags as untrusted strings.
- The default `pathConv` path-separator normalization in `getLogger` is for usability, not security.
- If a tag comes from user input, validate or sanitize it before passing it to `getLogger`.

## Dependency Security

- Pin runtime dependencies and let Yarn Berry lock them in `yarn.lock`.
- Scan new dependencies for known vulnerabilities before adding them.
- Avoid adding dependencies that perform network or filesystem I/O.

## Environment Safety

- Do not log environment variables, secrets, tokens, or credentials.
- If debug output must include configuration, redact sensitive keys first.

## Output Safety

- ANSI/color escapes are produced via `chalk` and controlled by `chalk.level`.
- Use `strip-ansi` when stripping color codes from output that will be processed by other systems. The library itself does not import `strip-ansi` or `supports-color`; they are listed in `dependencies` for consumer/test convenience and should be re-evaluated when tightening the runtime dependency surface.
- Ensure colorized output does not break terminals or log parsers that do not expect ANSI codes.

## Interface Safety

- The public API is small: `getLogger(tag, config?)`, `Logger`, `LogLevel`/`logLevels`/`isLogLevel`, and `colors`/`Colorify`.
- Keep it small; new surface area increases the risk of misuse.
- There is no `setLevel` API and no re-export of the `debug` package; do not document either as part of the public surface.

## Security Checklist

Before merging security-related changes, confirm:

- [ ] Untrusted input cannot reach log tags without validation or sanitization.
- [ ] New dependencies are pinned and scanned for known vulnerabilities.
- [ ] Environment variables are not logged accidentally.
- [ ] ANSI/color escapes are handled consistently with `strip-ansi` / `supports-color`.
