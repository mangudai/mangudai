import { LintError } from '../'
import { Script, SectionStatement } from '../../parse'
import { getNodes, getToken, getLastToken } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'

export function check (ast: Script): LintError[] {
  const errors: LintError[] = []
  const sections = getNodes(ast, 'SectionStatement') as SectionStatement[]
  sections.forEach(section => {
    if (section.statements.length === 0) {
      errors.push({
        name: 'LintError',
        message: `Empty section \'${section.name}\'.`,
        boundaries: {
          start: getBoundaries(getToken(section)).start,
          end: getBoundaries(getLastToken(section)).end
        }
      })
    }
  })

  return errors
}
