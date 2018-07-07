import { LintError } from '../'
import { Script, AttributeStatement } from '../../parse'
import { getToken, getChildNodes, getNodes, getLastToken } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'
import { isEqual, find } from 'lodash'

export function check (ast: Script): LintError[] {
  const dupeAttributes: AttributeStatement[] = []

  getNodes(ast, 'StatementsBlock').forEach(block => {
    const alreadySeenAttributes: AttributeStatement[] = []
    const attributes = getChildNodes(block, 'Attribute') as AttributeStatement[]
    attributes.forEach(attr => {
      if (find(alreadySeenAttributes, x => isEqual(x, attr))) dupeAttributes.push(attr)
      else alreadySeenAttributes.push(attr)
    })
  })

  return dupeAttributes.map<LintError>(x => ({
    name: 'LintError',
    message: `Duplicate attribute '${x.name}'.`,
    boundaries: {
      start: getBoundaries(getToken(x, undefined, true)).start,
      end: getBoundaries(getLastToken(x, undefined, true)).end
    }
  }))
}
