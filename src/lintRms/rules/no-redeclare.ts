import { Token } from 'moo'
import { LintError } from '../'
import { RmsAst } from '../../parseRms'
import { CstNode } from '../../parseRms/cst'
import { getNodes, getFirstToken } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'

export function check (ast: RmsAst): LintError[] {
  const seenIdentifiers: { [x: string]: boolean } = {}
  const redeclared: Token[] = []

  getNodes(ast, 'FlagDefinition').concat(getNodes(ast, 'ConstDefinition')).forEach((node: CstNode) => {
    const nameToken = getFirstToken(node, 'identifier') as Token
    if (seenIdentifiers[nameToken.value]) redeclared.push(nameToken)
    else seenIdentifiers[nameToken.value] = true
  })

  return redeclared.map(x => ({
    name: 'LintError',
    message: `Cannot redeclare '${x.value}'.`,
    boundaries: getBoundaries(x)
  } as LintError))
}
