import { DeprecatedTypeRule } from '../rules/deprecated-type.rule'
import { ruleTester } from './rule-tester'

ruleTester.run('deprecated-type', DeprecatedTypeRule, {
  valid: [
    `type Foo = string`,
    `type Foo = string | number`,
    `type Foo = string & number`,
    `type Foo<T> = T`,
    `type Foo = {}`,
    `interface Foo {}`,
    `interface Foo<T> {}`,
    `interface Foo extends Bar {}`,
  ],
  invalid: [
    {
      code: `type __Foo = string`,
      errors: [
        {
          messageId: 'deprecatedTypePrefix',
        },
      ],
    },
    {
      code: `type __Foo = string | number`,
      errors: [
        {
          messageId: 'deprecatedTypePrefix',
        },
      ],
    },
    {
      code: `type __Foo = {}`,
      errors: [
        {
          messageId: 'deprecatedTypePrefix',
        },
      ],
    },
    {
      code: `interface __Foo {}`,
      errors: [
        {
          messageId: 'deprecatedTypePrefix',
        },
      ],
    },
    {
      code: `interface __Foo extends Bar {}`,
      errors: [
        {
          messageId: 'deprecatedTypePrefix',
        },
      ],
    },
  ],
})
