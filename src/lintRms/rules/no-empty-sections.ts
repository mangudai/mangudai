import { LintError } from '../'
import { RmsAst, RmsSection } from '../../parseRms'
import { getNodes, getFirstToken, getLastToken } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'

export function check (ast: RmsAst): LintError[] {
  const errors: LintError[] = []
  getNodes(ast, 'Section').forEach((section: RmsSection) => {
    if (section.statements.length === 0) {
      errors.push({
        name: 'LintError',
        message: `Empty section \'${section.name}\'.`,
        boundaries: {
          start: getBoundaries(getFirstToken(section)).start,
          end: getBoundaries(getLastToken(section)).end
        }
      })
    }
  })

  return errors
}
