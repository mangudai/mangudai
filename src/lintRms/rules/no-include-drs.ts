import { LintError } from '../'
import { RmsAst } from '../../parseRms'
import { getNodes, getFirstToken, getLastToken } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'

export function check (ast: RmsAst): LintError[] {
  return getNodes(ast, 'IncludeDrs').map(x => ({
    name: 'LintError',
    message: "Do not use 'include_drs' outside of internal game maps.",
    boundaries: {
      start: getBoundaries(getFirstToken(x)).start,
      end: getBoundaries(getLastToken(x)).end
    }
  } as LintError))
}
