import { LintError } from '../'
import { Script, IfStatement } from '../../parseRms'
import { getNodes, getChildNode, getToken, getLastToken } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'

export function check (ast: Script): LintError[] {
  const errors: LintError[] = []
  getNodes(ast, 'IfStatement').forEach((ifNode: IfStatement) => {
    if (ifNode.elseStatements && ifNode.elseStatements.length === 0) {
      errors.push({
        name: 'LintError',
        message: "Empty \'else\'.",
        boundaries: {
          start: getBoundaries(getToken(getChildNode(ifNode, 'Else', true))).start,
          end: getBoundaries(getLastToken(getChildNode(ifNode, 'Else', true))).end
        }
      })
    }
  })

  return errors
}
