# @consenlabs-fe/eslint-config

[![npm](https://img.shields.io/npm/v/@consenlabs-fe/eslint-config?color=444&label=)](https://npmjs.com/package/@consenlabs-fe/eslint-config)

An Opinionated Flat ESLint config for Consenlabs team.

- Auto fix for formatting — no Prettier needed
- Reasonable defaults, best practices, only one line of config
- TypeScript support — auto-detected based on dependencies
- Optional React support — with Next.js / Remix / React Router auto-detection
- Support for JSON, JSONC, YAML out-of-box
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily!
- Style rules via [ESLint Stylistic](https://eslint.style/)
- Editor-aware — disables disruptive auto-fix rules when running in IDEs

> [!IMPORTANT]
> Since v1.0, this config is rewritten to the new [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new).

## Usage

### Install

```bash
pnpm add -D eslint @consenlabs-fe/eslint-config
```

### Create config file

Create `eslint.config.mjs` in your project root:

```js
// eslint.config.mjs
import consenlabs from '@consenlabs-fe/eslint-config'

export default consenlabs()
```

### Add script

```jsonc
// package.json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### VS Code support

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

Add the following settings to your `.vscode/settings.json`:

```jsonc
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },
  "editor.formatOnSave": false,
  "eslint.experimental.useFlatConfig": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "json",
    "jsonc",
    "yaml"
  ]
}
```

## Customization

### Options

All options are optional, the factory function works out-of-box with sensible defaults:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'app' \| 'lib'` | `'app'` | Project type. `'lib'` enables stricter rules for libraries |
| `javascript` | `OptionsOverrides` | — | Core JS rules (always enabled). Accepts `overrides` only |
| `typescript` | `boolean \| OptionsTypescript` | auto-detect | Auto-detected based on `typescript` in dependencies |
| `jsx` | `boolean` | `false` | Enable JSX stylistic rules |
| `react` | `boolean \| OptionsOverrides` | `false` | Enable React rules (requires installing peer deps) |
| `stylistic` | `boolean \| StylisticConfig` | `true` | Code style rules. Pass object for fine-grained control |
| `jsonc` | `boolean \| OptionsOverrides` | `true` | JSON / JSONC linting + auto-sort `package.json` & `tsconfig.json` |
| `yaml` | `boolean \| OptionsOverrides` | `true` | YAML linting |
| `unicorn` | `boolean \| OptionsUnicorn` | `true` | [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn) rules |
| `isInEditor` | `boolean` | auto-detect | Disable disruptive auto-fix rules in editors |

```js
// eslint.config.mjs
import consenlabs from '@consenlabs-fe/eslint-config'

export default consenlabs({
  type: 'app',
  typescript: true,
  jsx: true,
  react: true,
  stylistic: true,
})
```

### React

React support is **opt-in** (`false` by default). To enable it, install the required peer dependencies:

```bash
pnpm add -D @eslint-react/eslint-plugin eslint-plugin-react-hooks eslint-plugin-react-refresh
```

Then enable it in the config:

```js
// eslint.config.mjs
import consenlabs from '@consenlabs-fe/eslint-config'

export default consenlabs({
  react: true,
})
```

The config auto-detects Next.js, Remix, and React Router frameworks and adjusts rules accordingly.

### Stylistic

Stylistic rules are **enabled by default**. You can disable them or pass an object for fine-grained control:

```js
import consenlabs from '@consenlabs-fe/eslint-config'

export default consenlabs({
  // Disable all stylistic rules
  stylistic: false,

  // Or customize
  stylistic: {
    indent: 2,       // indent level, default: 2
    quotes: 'single', // quote style, default: 'single'
    semi: false,      // semicolons, default: false
    jsx: true,        // enable JSX stylistic rules
  },
})
```

### Type-Aware Rules

You can optionally enable [type-aware rules](https://typescript-eslint.io/linting/typed-linting/) by passing the `tsconfigPath` option to `typescript`:

```js
// eslint.config.mjs
import consenlabs from '@consenlabs-fe/eslint-config'

export default consenlabs({
  typescript: {
    tsconfigPath: './tsconfig.json',
    // Override type-aware rules specifically
    overridesTypeAware: {
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
})
```

Additional TypeScript sub-options:

| Option | Description |
| --- | --- |
| `tsconfigPath` | Path to tsconfig. Enables type-aware rules when provided |
| `overridesTypeAware` | Override rules that require type information |
| `parserOptions` | Additional parser options for `@typescript-eslint/parser` |
| `filesTypeAware` | Glob patterns for type-aware files (default: `['**/*.{ts,tsx}']`) |
| `ignoresTypeAware` | Glob patterns to ignore for type-aware linting |

### Unicorn

[eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn) is **enabled by default** with a curated subset of rules. To use all recommended rules:

```js
import consenlabs from '@consenlabs-fe/eslint-config'

export default consenlabs({
  unicorn: {
    recommended: true, // Use all recommended rules instead of the curated subset
  },
})
```

### Rules Overrides

The `javascript`, `typescript`, `react`, `stylistic`, `jsonc`, `yaml` options all accept an `overrides` object to customize individual rules:

```js
// eslint.config.mjs
import consenlabs from '@consenlabs-fe/eslint-config'

export default consenlabs({
  typescript: {
    overrides: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  stylistic: {
    overrides: {
      '@stylistic/semi': ['error', 'always'],
    },
  },
  react: {
    overrides: {
      '@eslint-react/no-nested-components': 'off',
    },
  },
})
```

### Composing Custom Configs

The factory function returns a [`FlatConfigComposer`](https://github.com/antfu/eslint-flat-config-utils#composer) object, so you can chain additional configs:

```js
// eslint.config.mjs
import consenlabs from '@consenlabs-fe/eslint-config'

export default consenlabs({
  typescript: true,
})
  .append({
    rules: {
      'no-console': 'warn',
    },
  })
```

You can also pass additional flat configs as rest arguments:

```js
// eslint.config.mjs
import consenlabs from '@consenlabs-fe/eslint-config'

export default consenlabs(
  { typescript: true },
  {
    files: ['**/*.test.ts'],
    rules: {
      'no-console': 'off',
    },
  },
)
```

### Editor Behavior

When running in an editor (VS Code, JetBrains, Vim, etc.), the config automatically detects the environment and disables auto-fix for certain disruptive rules like `prefer-const` and `unused-imports/no-unused-imports`.

You can override this behavior:

```js
import consenlabs from '@consenlabs-fe/eslint-config'

export default consenlabs({
  isInEditor: false, // Always apply full rules
})
```

### Config Inspector

Run the [ESLint Config Inspector](https://github.com/eslint/config-inspector) to visualize and inspect the applied rules:

```bash
npx @eslint/config-inspector
```

### lint-staged

If you want to apply lint and auto-fix before every commit, you can add the following to your `package.json`:

```jsonc
{
  "simple-git-hooks": {
    "pre-commit": "npx lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
}
```

## Included Plugins

| Plugin | Description |
| --- | --- |
| [@typescript-eslint](https://typescript-eslint.io/) | TypeScript linting |
| [@stylistic/eslint-plugin](https://eslint.style/) | Code style formatting |
| [eslint-plugin-import-x](https://github.com/un-ts/eslint-plugin-import-x) | Import statement rules |
| [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn) | Various useful rules |
| [eslint-plugin-unused-imports](https://github.com/sweepline/eslint-plugin-unused-imports) | Remove unused imports |
| [eslint-plugin-jsonc](https://github.com/ota-meshi/eslint-plugin-jsonc) | JSON / JSONC linting |
| [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml) | YAML linting |
| [@eslint-react/eslint-plugin](https://eslint-react.xyz/) | React rules (optional) |
| [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) | React Hooks rules (optional) |
| [eslint-plugin-react-refresh](https://github.com/ArnaudBarre/eslint-plugin-react-refresh) | React Refresh rules (optional) |

## License

[MIT](./LICENSE)
