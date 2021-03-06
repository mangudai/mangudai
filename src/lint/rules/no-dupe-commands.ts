import { isEqual } from 'lodash'
import { LintError } from '../'
import { Script, CommandStatement, ConditionalCommandStatement } from '../../parse'
import { getToken, getChildren, getLastToken, getNodes } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'

export function check (ast: Script): LintError[] {
  const dupeCommands: [CommandStatement | ConditionalCommandStatement, string][] = []

  getNodes(ast, 'StatementsBlock').forEach(block => {
    const alreadySeenCommands: CommandStatement[] = []
    const commands = getChildren(block, 'Command') as CommandStatement[]
    commands.forEach(command => {
      if (alreadySeenCommands.some(x => isEqual(x, command))) {
        dupeCommands.push([command, `Duplicate command '${command.name}' with exactly the same arguments and attibutes.`])
      } else {
        alreadySeenCommands.push(command)
      }
    })

    const alreadySeenConditionalCommands: ConditionalCommandStatement[] = []
    const conditionalCommands = getChildren(block, 'ConditionalCommand') as ConditionalCommandStatement[]
    conditionalCommands.forEach(command => {
      if (alreadySeenConditionalCommands.some(x => isEqual(x, command))) {
        dupeCommands.push([command, `Duplicate command with exactly the same alternatives, arguments, and attibutes.`])
      } else {
        alreadySeenConditionalCommands.push(command)
      }
    })
  })

  return dupeCommands.map<LintError>(([node, message]) => ({
    name: 'LintError',
    message,
    boundaries: {
      start: getBoundaries(getToken(node)).start,
      end: getBoundaries(getLastToken(node)).end
    }
  }))
}
