# Security Guide

## Authentication

- Not applicable: this is a logging utility with no authentication flows.

## Input Sanitization

- Treat externally supplied log tags as untrusted strings.
- The default path-separator normalization in `getLogger` is for usability, not security.
- If a tag comes from user input, validate or sanitize it before passing it to `getLogger`.

## Dependency Security

- Pin runtime dependencies and let Yarn Berry lock them in `yarn.lock`.
- Scan new dependencies for known vulnerabilities before adding them.
- Avoid adding dependencies that perform network or filesystem I/O.

## Environment Safety

- Do not log environment variables, secrets, tokens, or credentials.
- If debug output must include configuration, redact sensitive keys first.

## Output Safety

- ANSI/color escapes are produced via `chalk` and controlled by `supports-color`.
- Use `strip-ansi` when stripping color codes from output that will be processed by other systems.
- Ensure colorized output does not break terminals or log parsers that do not expect ANSI codes.

## Interface Safety

- The public API is small: `getLogger`, `setLevel`, and re-exports from `debug`.
- Keep it small; new surface area increases the risk of misuse.

## Security Checklist

Before merging security-related changes, confirm:

- [ ] Untrusted input cannot reach log tags without validation or sanitization.
- [ ] New dependencies are pinned and scanned for known vulnerabilities.
- [ ] Environment variables are not logged accidentally.
- [ ] ANSI/color escapes are handled consistently with `strip-ansi` / `supports-color`.
