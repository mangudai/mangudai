import { Token } from 'moo'
import { LintError } from '../'
import { Script, AttributeStatement } from '../../parseRms'
import { getToken, getChildNodes, getNodes } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'

export function check (ast: Script): LintError[] {
  const dupeAttributeNames: Token[] = []

  getNodes(ast, 'StatementsBlock').forEach(block => {
    const alreadySeenAttrs: string[] = []
    getChildNodes(block, 'Attribute').forEach((attr: AttributeStatement) => {
      if (alreadySeenAttrs.includes(attr.name)) dupeAttributeNames.push(getToken(attr, 'identifier', true))
      else alreadySeenAttrs.push(attr.name)
    })
  })

  return dupeAttributeNames.map<LintError>(x => ({
    name: 'LintError',
    message: `Duplicate attribute '${x.value}'.`,
    boundaries: getBoundaries(x)
  }))
}
