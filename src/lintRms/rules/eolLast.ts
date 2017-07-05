import { LintError } from '../'
import { RmsAst } from '../../parseRms'
import { getLastToken } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'

export function check (ast: RmsAst): LintError[] {
  const lastToken = getLastToken(ast)
  if (lastToken && lastToken.type === 'LineBreak' && lastToken.value.endsWith('\n')) {
    return []
  } else {
    return [{
      name: 'LintError',
      message: 'Newline required at end of file but not found.',
      boundaries: getBoundaries(lastToken)
    }]
  }
}
