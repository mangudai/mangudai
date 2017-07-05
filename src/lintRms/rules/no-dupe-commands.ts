import { isEqual } from 'lodash'
import { LintError } from '../'
import { CstNode } from '../../parseRms/cst'
import { RmsAst, RmsCommand } from '../../parseRms'
import { getFirstToken, getDescendants, getChildren, getLastToken } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'

export function check (ast: RmsAst): LintError[] {
  const dupeCommands: RmsCommand[] = []

  getDescendants(ast, 'StatementsBlock').forEach((block: CstNode) => {
    const alreadySeenCommands: RmsCommand[] = []
    getChildren(block, 'Command').forEach((command: RmsCommand) => {
      if (alreadySeenCommands.some(x => isEqual(x, command))) {
        dupeCommands.push(command)
      } else {
        alreadySeenCommands.push(command)
      }
    })
  })

  return dupeCommands.map<LintError>(x => ({
    name: 'LintError',
    message: `Duplicate command '${x.name}' with exactly the same arguments and attibutes.`,
    boundaries: {
      start: getBoundaries(getFirstToken(x)).start,
      end: getBoundaries(getLastToken(x)).end
    }
  }))
}
