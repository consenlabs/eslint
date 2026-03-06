import { ensurePackages, interopDefault } from '../utils'
import type { OptionsOverrides, TypedFlatConfigItem } from '../types'

/**
 * Normalize rules from legacy config format to flat config format.
 * Converts string rule values (e.g. 'warn') to array format (e.g. ['warn']).
 */
function normalizeRules(rules: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(rules).map(([key, value]) => [
      key,
      typeof value === 'string' ? [value] : value,
    ]),
  )
}

export async function nextjs(
  options: OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options

  await ensurePackages([
    '@next/eslint-plugin-next',
  ])

  const pluginNext = await interopDefault(import('@next/eslint-plugin-next'))

  const recommendedRules = normalizeRules(pluginNext.configs.recommended.rules)
  const coreWebVitalsRules = normalizeRules(pluginNext.configs['core-web-vitals'].rules)

  return [
    {
      name: 'consenlabs/nextjs/setup',
      plugins: {
        '@next/next': pluginNext,
      },
    },
    {
      name: 'consenlabs/nextjs/rules',
      rules: {
        ...recommendedRules,
        ...coreWebVitalsRules,
        ...overrides,
      },
    },
  ]
}
