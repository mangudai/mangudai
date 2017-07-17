import { Script } from '../parse'
import { TextSpanError } from '../tokenHelpers'

const rules: { [x: string]: { check: (ast: Script, options: any) => LintError[] } } = {
  // Possible errors
  noConstantCondition: require('./rules/no-constant-condition'),
  noDupeAttributes: require('./rules/no-dupe-attributes'),
  noDupeCommands: require('./rules/no-dupe-commands'),
  noEmptyElse: require('./rules/no-empty-else'),
  noEmptySections: require('./rules/no-empty-sections'),
  noIncludeDrs: require('./rules/no-include-drs'),
  noRedeclare: require('./rules/no-redeclare'),

  // Stylistic issues
  eolLast: require('./rules/eol-last')
}

export function lint (ast: Script | undefined, options: { [x: string]: any } = {}): LintError[] {
  const errors: LintError[] = []
  if (!ast) return errors
  Object.entries(rules).forEach(([name, rule]) => errors.push(...rule.check(ast, options[name])))
  return errors
}

export interface LintError extends TextSpanError {
  name: 'LintError'
}
