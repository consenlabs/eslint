import fs from 'node:fs/promises'

import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import { builtinRules } from 'eslint/use-at-your-own-risk'

import { combine, react, typescript, jsx, javascript, ignores, stylistic } from '../src'

const configs = await combine(
  {
    plugins: {
      '': {
        rules: Object.fromEntries(builtinRules.entries()),
      },
    },
  },
  javascript(),
  typescript(),
  jsx(),
  react(),
  ignores(),
  stylistic(),
)

const configNames = configs.map(i => i.name).filter(Boolean) as string[]

let dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false,
})

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.length > 0 ? configNames.map(i => `'${i}'`).join(' | ') : 'never'}
`

await fs.writeFile('src/typegen.d.ts', dts)
