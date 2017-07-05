import { RmsAst } from '../parseRms'
import * as eolLast from './rules/eolLast'

const rules = [
  eolLast
]

export function lint (ast: RmsAst): LintError[] {
  const errors: LintError[] = []
  rules.forEach(rule => errors.push(...rule.check(ast)))
  return errors
}

export interface LintError extends Error {
  name: 'LintError',
  message: string,
  boundaries: ErrorBoundaries
}

export interface ErrorBoundaries {
  start: {
    line: number,
    col: number
  },
  end: {
    line: number,
    col: number
  }
}
