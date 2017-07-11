import { Token } from 'moo'
import { LintError } from '../'
import { CstNode } from '../../parseRms/cst'
import { RmsAst, RmsAttribute } from '../../parseRms'
import { getDescendants, getFirstToken, getChildNodes } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'

export function check (ast: RmsAst): LintError[] {
  const dupeAttributeNames: Token[] = []

  getDescendants(ast, 'StatementsBlock').forEach((block: CstNode) => {
    const alreadySeenAttrs: string[] = []
    getChildNodes(block, 'Attribute').forEach((attr: RmsAttribute) => {
      if (alreadySeenAttrs.includes(attr.name)) dupeAttributeNames.push(getFirstToken(attr, 'identifier') as Token)
      else alreadySeenAttrs.push(attr.name)
    })
  })

  return dupeAttributeNames.map<LintError>(x => ({
    name: 'LintError',
    message: `Duplicate attribute '${x.value}'.`,
    boundaries: getBoundaries(x)
  }))
}
