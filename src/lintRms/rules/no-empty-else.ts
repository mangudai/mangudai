import { LintError } from '../'
import { RmsAst, RmsIf } from '../../parseRms'
import { CstNode } from '../../parseRms/cst'
import { getNodes, getFirstChildNode, getFirstToken, getLastToken } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'

export function check (ast: RmsAst): LintError[] {
  const errors: LintError[] = []
  getNodes(ast, 'IfStatement').forEach((ifNode: RmsIf<any>) => {
    if (ifNode.elseStatements && ifNode.elseStatements.length === 0) {
      errors.push({
        name: 'LintError',
        message: "Empty \'else\'.",
        boundaries: {
          start: getBoundaries(getFirstToken(getFirstChildNode(ifNode, 'Else') as CstNode)).start,
          end: getBoundaries(getLastToken(getFirstChildNode(ifNode, 'Else') as CstNode)).end
        }
      })
    }
  })

  return errors
}
