import { RmsAst } from '../parseRms'
import * as eolLast from './rules/eol-last'
import * as noConstantCondition from './rules/no-constant-condition'
import * as noDupeAttributes from './rules/no-dupe-attributes'
import { TextSpan } from '../tokenHelpers'

const rules: { [x: string]: { check: (ast: RmsAst, options: any) => LintError[] } } = {
  noConstantCondition,
  noDupeAttributes,
  eolLast
}

export function lint (ast: RmsAst, options: LinterOptions = {}): LintError[] {
  const errors: LintError[] = []
  Object.entries(rules).forEach(([name, rule]) => errors.push(...rule.check(ast, options[name])))
  return errors
}

export interface LinterOptions {
  // Hack to make options accessible via options[name].
  [x: string]: any

  eolLast?: eolLast.RuleOptions
}

export interface LintError extends Error {
  name: 'LintError',
  message: string,
  boundaries: TextSpan
}
