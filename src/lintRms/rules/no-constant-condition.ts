import { Token } from 'moo'
import { LintError } from '../'
import { RmsAst, RmsIf, ElseIf, RmsFlagDefinition } from '../../parseRms'
import { getDescendants, getFirstToken, getNodes } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'

export function check (ast: RmsAst): LintError[] {
  const conditionallyDefinedFlags: string[] = []
  const unconditionallyDefinedFlags: string[] = []
  const invalidConditionIdentifiers: Token[] = []

  getNodes(ast, 'IfStatement').concat(getNodes(ast, 'ChanceStatement')).forEach(parent => {
    conditionallyDefinedFlags.push(...getNodes(parent, 'FlagDefinition').map((x: RmsFlagDefinition) => x.flag))
  })

  getDescendants(ast, 'FlagDefinition').forEach(({ flag }: RmsFlagDefinition) => {
    if (!conditionallyDefinedFlags.includes(flag)) unconditionallyDefinedFlags.push(flag)
  })

  const allIfs = [...getDescendants(ast, 'IfStatement'), ...getDescendants(ast, 'ElseIfStatement')]
  allIfs.forEach((ifNode: RmsIf<any> | ElseIf<any>) => {
    if (unconditionallyDefinedFlags.includes(ifNode.condition)) {
      invalidConditionIdentifiers.push(getFirstToken(ifNode, 'identifier') as Token)
    }
  })

  return invalidConditionIdentifiers.map<LintError>(x => ({
    name: 'LintError',
    message: `Condition '${x.value}' is always true.`,
    boundaries: getBoundaries(x)
  }))
}
