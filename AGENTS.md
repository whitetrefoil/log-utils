# AGENTS.md

> AI Agent's single entry point. Progressive disclosure: core rules live here; detailed guidance is loaded on demand from `.ai-docs/`.

## Purpose

- Help AI Agents evolve the existing baseline safely.
- Prefer minimal changes that match established patterns.
- Keep "baseline infrastructure", "team conventions", and "business implementation" distinct.

## How to Use

- Treat this file as the default guide and keep it updated as the project evolves.
- `README.md` is for humans; `AGENTS.md` is for Agents.
- Update this file whenever new architectural boundaries form.

## Language Convention

- Default language for project docs, constraints, and commit messages: **English (en-US)**.
- Reasoning: this is a public open-source package (`@whitetrefoil/log-utils`), hosted on GitHub, and not an internal `@dwzq` project.
- Hard exception: any local docs not under VCS (e.g. `.omo/reviews/`, files excluded by `.gitignore`) must be in **Simplified Chinese** unless the user explicitly requests otherwise.
- Agents must follow this convention when producing or modifying team-facing docs, comments, constraints, or commit messages.

## Knowledge Map Maintenance Rules (Mandatory)

### Rule 1: Update with Every Change

Any code change must be accompanied by a corresponding knowledge-map update.

| Change | Update |
| --- | --- |
| Public API changes | `.ai-docs/dev-guide.md` |
| New/removed modules or directories | `.ai-docs/architecture.md` |
| Large-scale moves or renames | Re-run or refresh CodeGraph index; update `.ai-docs/architecture.md` boundaries if needed |
| State/logic pattern changes | `.ai-docs/dev-guide.md` |
| Test strategy changes | `.ai-docs/testing-guide.md` |
| Dependency or stack changes | `AGENTS.md` |

Timing: knowledge-map updates must be part of the same batch as the code change, before commit.

### Rule 2: Pause on Contradictions

If the project reality contradicts the knowledge map, stop immediately:

1. **Pause** the current task.
2. **Record** the contradiction (file path, actual behavior, map description).
3. **Report** it to the user and confirm which source is authoritative.
4. **Update** the knowledge map based on the decision.
5. **Resume** the original task.

Forbidden:

- Ignoring the contradiction and continuing.
- Assuming the map or the code is correct without confirmation.
- Updating later as an afterthought.

### Rule 3: Periodic Validation

At the start of each work session, quickly validate the knowledge map:

- [ ] `.ai-docs/architecture.md` top-level modules and boundaries match the code.
- [ ] The active CodeGraph/knowledge-map preset is recorded and respected.
- [ ] CodeGraph index covers the current source (if using CodeGraph preset).
- [ ] `.ai-docs/dev-guide.md` API contracts match the actual exports.
- [ ] `AGENTS.md` tech-stack table matches `package.json`.
- [ ] Test guide matches `vitest.config.ts` and actual tests.
- [ ] Security guide matches authentication/output handling reality.

If any check fails, apply Rule 2.

---

## Tech Stack

| Layer | Technology | Version / Constraint |
| --- | --- | --- |
| Runtime | Node.js | `>= 24` |
| Language | TypeScript | `^6.0.3` |
| Module System | ESM (`NodeNext`) | `"type": "module"` in `package.json` |
| Build | TypeScript compiler | `tsc -p src/tsconfig.json` |
| Test | Vitest | `^4.1.9` with `@vitest/coverage-v8` |
| Lint | ESLint | `^10.6.0` via `@whitetrefoil/eslint-config` |
| Package Manager | Yarn | `4.17.0` (Berry) |
| Runtime Dependencies | `chalk`, `debug`, `slash`, `strip-ansi`, `supports-color`, `time-stamp` | See `package.json` |

## Project Overview

- A small ESM utility library for tagged logging, built on top of `debug` and console output.
- Public API surface: `getLogger(tag, disableNormalization?)`, `setLevel(level)`, and re-exports from `debug`.
- Entry point: `src/main.ts` compiles to `lib/main.js`; consumers import from `@whitetrefoil/log-utils`.
- Key boundaries: logger construction (`src/logger.ts`), log-level management (`src/level.ts`), color/format helpers (`src/colors.ts`).
- No bundler: the project is compiled directly by `tsc` into the `lib/` directory.
- Detailed architecture, API contracts, testing, performance, and security guidance are in `.ai-docs/`.

## Coding Constraints

- **ESM only**: the package cannot be consumed as CommonJS.
- **Strict TypeScript**: `strict`, `noImplicitReturns`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax` are enabled.
- **NodeNext module resolution**: use full file extensions in imports and respect ESM semantics.
- **`no-console` is intentionally disabled** because this library's purpose is console output.
- **Tests live next to source** conceptually, but in this repo the `tests/` directory mirrors `src/`; test files are excluded from `lib/` by `src/tsconfig.json`.
- Keep public API changes minimal and backwards-compatible where possible.

## Information Index

| Path | Content | When to Read |
| --- | --- | --- |
| `.ai-docs/architecture.md` | System architecture, boundaries, CodeGraph query entry | Adding modules or refactoring |
| `.ai-docs/dev-guide.md` | Naming conventions, API contracts, lint rules | Writing or reviewing code |
| `.ai-docs/testing-guide.md` | Vitest setup, coverage, test conventions | Writing tests |
| `.ai-docs/performance.md` | Build/runtime optimization constraints | Performance work |
| `.ai-docs/security.md` | Logging/output security checklist | Security-related changes |

## CodeGraph / Knowledge Map Preset

- **Current preset:** CodeGraph (`.codegraph/` already exists and the `codegraph` CLI is installed).
- Use `codegraph explore "question or symbol"` to understand cross-file relationships.
- Use `codegraph node <symbol or file>` to inspect a symbol's source, callers, or file body.
- Do not duplicate CodeGraph-queryable facts (full file trees, symbol tables, call graphs) into Markdown.
- If you need to switch presets, re-run `/inject-knowledge-map` and follow the upgrade path.

## Common Commands

| Command | Purpose |
| --- | --- |
| `yarn install` | Install dependencies |
| `yarn build` | Compile `src/` into `lib/` |
| `yarn watch` | Compile in watch mode |
| `yarn test` | Run Vitest with coverage and ESLint |

## Knowledge Map Update Triggers

Update the relevant knowledge-map file whenever:

1. A new public export is added or an existing one is changed.
2. Logger output format, color behavior, or level semantics change.
3. Runtime dependencies are added, removed, or upgraded.
4. Build, test, lint, or TypeScript configuration changes.
5. A new source directory or module boundary emerges.
6. Security-relevant behavior (e.g., handling untrusted log tags) changes.

## Security Change Checklist

Before merging security-related changes, confirm:

- [ ] Untrusted input cannot reach log tags without validation or sanitization.
- [ ] New dependencies are pinned and scanned for known vulnerabilities.
- [ ] Environment variables are not logged accidentally.
- [ ] ANSI/color escapes are handled consistently with `strip-ansi` / `supports-color`.
