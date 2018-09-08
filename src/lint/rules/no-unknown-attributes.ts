/// <reference path="meant/index.d.ts">
import { LintError } from '../'
import { Script, AttributeStatement } from '../../parse'
import { getToken, getChildNodes, getNodes } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'
import { aocCommands, dlcCommands, userpatchCommands } from '../../lib'
import * as meant from 'meant'

const ATTRIBUTE_NAMES = [
  aocCommands,
  dlcCommands,
  userpatchCommands
].reduce((names, version) => {
  Object.keys(version).forEach((sectionName) => {
    const { commands } = version[sectionName]
    if (commands === undefined) {
      return
    }
    Object.keys(commands).forEach((commandName) => {
      // Also adding command names here because commands like
      // if X create_object BOAR else create_object DEER endif {}
      // are parsed as If(Attribute, Attribute) rather than commands
      // It would be nice to distinguish between these in the future
      // so we can warn if create_object is used inside a {} for some reason
      names.push(commandName)
      const { attributes } = commands[commandName]
      if (attributes !== undefined) {
        names.push(...Object.keys(attributes))
      }
    })
  })

  return names
}, [] as string[])

function didYouMean (name: string) {
  const closest = meant(name, ATTRIBUTE_NAMES)
  if (closest.length === 0) return ''
  return ` Did you mean '${closest[0]}'?`
}

export function check (ast: Script): LintError[] {
  const unknownAttributes: AttributeStatement[] = []

  getNodes(ast, 'StatementsBlock').forEach(block => {
    const attributes = getChildNodes(block, 'Attribute') as AttributeStatement[]
    attributes.forEach(attr => {
      if (ATTRIBUTE_NAMES.indexOf(attr.name) === -1) {
		  unknownAttributes.push(attr)
      }
    })
  })

  return unknownAttributes.map<LintError>(x => ({
    name: 'LintError',
    message: `Unknown attribute '${x.name}'.${didYouMean(x.name)}`,
    boundaries: {
      start: getBoundaries(getToken(x, undefined, true)).start,
      end: getBoundaries(getToken(x, undefined, true)).end
    }
  }))
}
