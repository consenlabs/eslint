import { ESLintUtils, TSESTree } from '@typescript-eslint/utils'

const createRule = ESLintUtils.RuleCreator(name => ``)

const DEPRECATED_TYPE_NAME_PREFIX = '__'

export const DeprecatedTypeRule = createRule({
  create: context => {
    const reportDeprecatedTypePrefixError = (
      node: TSESTree.TSTypeAliasDeclaration | TSESTree.TSInterfaceDeclaration,
    ) => {
      if (node.id.name.startsWith(DEPRECATED_TYPE_NAME_PREFIX)) {
        context.report({
          node,
          messageId: 'deprecatedTypePrefix',
        })
      }
    }

    return {
      TSTypeAliasDeclaration: reportDeprecatedTypePrefixError,
      TSInterfaceDeclaration: reportDeprecatedTypePrefixError,
    }
  },
  meta: {
    docs: {
      description: `The old code from TokenV2 project used the "__" prefix to name types to distinguish values, but now it's obsolete.`,
      recommended: 'warn',
    },
    messages: {
      deprecatedTypePrefix:
        'Type names like "__" prefix have been deprecated, please use PascalCase instead.',
    },
    type: 'suggestion',
    schema: [],
  },
  name: 'no-deprecated-type-name-prefix',
  defaultOptions: [],
})
