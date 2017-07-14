import { LintError } from '../'
import { Script } from '../../parseRms'
import { getNodes, getToken, getLastToken } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'

export function check (ast: Script): LintError[] {
  return getNodes(ast, 'IncludeDrsStatement').map(x => ({
    name: 'LintError',
    message: "Do not use 'include_drs' outside of internal game maps.",
    boundaries: {
      start: getBoundaries(getToken(x)).start,
      end: getBoundaries(getLastToken(x)).end
    }
  } as LintError))
}
