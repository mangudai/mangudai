/// <reference path="meant/index.d.ts">
import { LintError } from '../'
import { Script, CommandStatement } from '../../parse'
import { getToken, getNodes } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'
import { aocCommands, dlcCommands, userpatchCommands } from '../../lib'
import * as meant from 'meant'

const COMMAND_NAMES = [
  aocCommands,
  dlcCommands,
  userpatchCommands
].reduce((names, version) => {
  Object.keys(version).forEach((sectionName) => {
    const { commands } = version[sectionName]
    if (commands != null) {
      const keys = Object.keys(commands)
      names.push(...keys)
    }
  })

  return names
}, [] as string[])

function didYouMean (name: string) {
  const closest = meant(name, COMMAND_NAMES)
  if (closest.length === 0) return ''
  return ` Did you mean '${closest[0]}'?`
}

export function check (ast: Script): LintError[] {
  const unknownCommands: CommandStatement[] = []

  const commands = getNodes(ast, 'CommandStatement') as CommandStatement[]
  commands.forEach(cmd => {
    if (COMMAND_NAMES.indexOf(cmd.name) === -1) {
      unknownCommands.push(cmd)
    }
  })

  return unknownCommands.map<LintError>(x => ({
    name: 'LintError',
    message: `Unknown command '${x.name}'.${didYouMean(x.name)}`,
    boundaries: {
      start: getBoundaries(getToken(x, undefined, true)).start,
      end: getBoundaries(getToken(x, undefined, true)).end
    }
  }))
}
