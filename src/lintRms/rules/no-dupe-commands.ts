import { isEqual } from 'lodash'
import { LintError } from '../'
import { Script, CommandStatement } from '../../parseRms'
import { getToken, getChildren, getLastToken, getNodes } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'

export function check (ast: Script): LintError[] {
  const dupeCommands: CommandStatement[] = []

  getNodes(ast, 'StatementsBlock').forEach(block => {
    const alreadySeenCommands: CommandStatement[] = []
    getChildren(block, 'Command').forEach((command: CommandStatement) => {
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
      start: getBoundaries(getToken(x)).start,
      end: getBoundaries(getLastToken(x)).end
    }
  }))
}
