import fs from 'node:fs/promises'

import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import { builtinRules } from 'eslint/use-at-your-own-risk'

import {
  combine,
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
  unicorn,
} from '../src'

const configs = await combine(
  {
    plugins: {
      '': {
        rules: Object.fromEntries(builtinRules.entries()),
      },
    },
  },
  jsx(),
  typescript(),
  javascript(),
  react(),
  stylistic(),
  ignores(),
  jsonc(),
  sortPackageJson(),
  sortTsconfig(),
  imports(),
  unicorn(),
)

const configNames = configs.map(index => index.name).filter(Boolean) as string[]

let dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false,
})

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.length > 0 ? configNames.map(index => `'${index}'`).join(' | ') : 'never'}
`

await fs.writeFile('src/typegen.d.ts', dts)
