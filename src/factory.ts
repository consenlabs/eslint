import type { Awaitable, ConfigOptions, TypedFlatConfigItem } from './types'
import { isPackageExists } from 'local-pkg'
import { isInEditorEnv } from './utils'
import type { Linter } from 'eslint'
import { FlatConfigComposer } from 'eslint-flat-config-utils'
import {
  jsx,
  typescript,
  javascript,
  react,
  stylistic,
  ignores,
  jsonc,
  sortPackageJson,
  sortTsconfig,
  imports,
} from './configs'
import type { ConfigNames, RuleOptions } from './typegen'

export function consenlabs(
  options: ConfigOptions,
  ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]>[]
) {
  const {
    typescript: enableTypeScript = isPackageExists('typescript'),
    jsx: enableJsx = false,
    react: enableReact = false,
  } = options

  let isInEditor = options.isInEditor
  if (isInEditor == null) {
    isInEditor = isInEditorEnv()
    if (isInEditor)
      // eslint-disable-next-line no-console
      console.log('[@consenlabs-fe/eslint-config] Detected running in editor, some rules are disabled.')
  }

  const stylisticOptions = options.stylistic === false
    ? false
    : typeof options.stylistic === 'object'
      ? options.stylistic
      : {}

  if (stylisticOptions && !('jsx' in stylisticOptions))
    stylisticOptions.jsx = enableJsx

  const configs: Awaitable<TypedFlatConfigItem[]>[] = []

  const typescriptOptions = resolveSubOptions(options, 'typescript')
  const tsconfigPath = 'tsconfigPath' in typescriptOptions ? typescriptOptions.tsconfigPath : undefined

  configs.push(
    ignores(),
    javascript({
      isInEditor,
      overrides: getOverrides(options, 'javascript'),
    }),
    imports({
      stylistic: stylisticOptions,
    }),
  )

  if (enableJsx)
    configs.push(jsx())

  if (enableTypeScript)
    configs.push(typescript({
      ...typescriptOptions,
      overrides: getOverrides(options, 'typescript'),
      type: options.type,
    }))

  if (options.jsonc ?? true)
    configs.push(
      jsonc({
        overrides: getOverrides(options, 'jsonc'),
        stylistic: stylisticOptions,
      }),
      sortPackageJson(),
      sortTsconfig(),
    )

  if (stylisticOptions)
    configs.push(stylistic({
      ...stylisticOptions,
      overrides: getOverrides(options, 'stylistic'),
    }))

  if (enableReact)
    configs.push(react({
      ...typescriptOptions,
      overrides: getOverrides(options, 'react'),
      tsconfigPath,
    }))

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>()

  composer = composer
    .append(
      ...configs,
      ...userConfigs as any,
    )

  return composer
}

export type ResolvedOptions<T> = T extends boolean
  ? never
  : NonNullable<T>

export function resolveSubOptions<K extends keyof ConfigOptions>(
  options: ConfigOptions,
  key: K,
): ResolvedOptions<ConfigOptions[K]> {
  return typeof options[key] === 'boolean'
    ? {} as any
    : options[key] || {} as any
}

export function getOverrides<K extends keyof ConfigOptions>(
  options: ConfigOptions,
  key: K,
): Partial<Linter.RulesRecord & RuleOptions> {
  const sub = resolveSubOptions(options, key)
  if ('overrides' in sub)
    return sub.overrides as Partial<Linter.RulesRecord & RuleOptions>

  return {}
}
