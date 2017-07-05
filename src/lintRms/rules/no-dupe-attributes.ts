import { Token } from 'moo'
import { LintError } from '../'
import { RmsAst, RmsCommand, RmsAttribute } from '../../parseRms'
import { getAstDescendants, getFirstToken } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'

export function check (ast: RmsAst): LintError[] {
  const dupeAttributeNames: Token[] = []

  getAstDescendants(ast, 'Command').forEach((command: RmsCommand) => {
    const alreadySeenAttrs: string[] = []
    getAstDescendants(command, 'Attribute').forEach((attr: RmsAttribute) => {
      if (alreadySeenAttrs.includes(attr.name)) dupeAttributeNames.push(getFirstToken(attr, 'Identifier') as Token)
      else alreadySeenAttrs.push(attr.name)
    })
  })

  return dupeAttributeNames.map<LintError>(x => ({
    name: 'LintError',
    message: `Duplicate attribute '${x.value}'.`,
    boundaries: getBoundaries(x)
  }))
}
