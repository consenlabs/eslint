# CLAUDE.md

## Project Overview

`@consenlabs-fe/eslint-config` — a single-package ESLint Flat Config for the Consenlabs team. Exposes a composable `consenlabs()` factory function that returns a `FlatConfigComposer`.

## Tech Stack

- **Runtime**: ESM (`"type": "module"`)
- **Language**: TypeScript (strict mode, ESNext target)
- **Package manager**: pnpm (workspace with catalogs in `pnpm-workspace.yaml`)
- **Build**: tsdown → `dist/index.mjs` + `dist/index.d.ts`
- **Type generation**: `eslint-typegen` → `src/typegen.d.ts` (auto-generated, git-ignored)

## Commands

| Command | What it does |
|---|---|
| `pnpm build` | Run typegen then tsdown build |
| `pnpm lint` | Run ESLint on the project itself |
| `pnpm typegen` | Regenerate `src/typegen.d.ts` from flat configs |
| `pnpm dev` | Launch ESLint Config Inspector |

## Project Structure

```
src/
├── index.ts          # Main entry — re-exports factory, configs, types
├── factory.ts        # consenlabs() factory function (core API)
├── types.ts          # All TypeScript type definitions
├── utils.ts          # Helpers: interopDefault, ensurePackages, isInEditorEnv
├── globs.ts          # Glob patterns for file matching
├── typegen.d.ts      # Auto-generated (do NOT edit)
└── configs/          # Each config module is an async function → TypedFlatConfigItem[]
    ├── javascript.ts # Core JS rules (always enabled)
    ├── typescript.ts # TS rules + optional type-aware rules
    ├── react.ts      # React / JSX / Hooks (opt-in, requires peer deps)
    ├── stylistic.ts  # @stylistic/eslint-plugin formatting rules
    ├── imports.ts    # eslint-plugin-import-x
    ├── unicorn.ts    # eslint-plugin-unicorn (curated subset)
    ├── jsonc.ts      # JSON / JSONC linting
    ├── yaml.ts       # YAML linting
    ├── jsx.ts        # JSX rules (currently empty)
    ├── sort.ts       # Auto-sort package.json & tsconfig.json fields
    ├── ignore.ts     # Global ignore patterns
    └── index.ts      # Re-exports all config functions
scripts/
└── typegen.ts        # Generates typegen.d.ts via eslint-typegen
```

## Key Conventions

- **Functional style** — no classes; factory functions and plain objects throughout.
- **Adding a new config module**: create `src/configs/<name>.ts` exporting an async function that returns `TypedFlatConfigItem[]`, wire it into `src/configs/index.ts` and `src/factory.ts`.
- **Rule naming**: config names follow the pattern `consenlabs/<scope>` (e.g. `consenlabs/typescript/rules`).
- **No tests** — the project currently has no test suite. Validate changes by running `pnpm lint` and `pnpm build`.
- **`src/typegen.d.ts` is auto-generated** — always run `pnpm typegen` after changing configs, never edit it manually.

## Git Hooks

- Pre-commit: `lint-staged` runs `eslint --fix` on staged files via `simple-git-hooks`.

## CI/CD

- Publish workflow (`.github/workflows/publish.yml`): triggered by `v*` tags, uses pnpm + Node LTS, auto-generates changelog via `changelogithub`.
