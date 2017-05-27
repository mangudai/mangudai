import { lex } from './lex'
import { RmsCstParser } from './cst'
import { createVisitor, RmsAst } from './ast'
import { ILexingError, exceptions } from 'chevrotain'

const parser = new RmsCstParser([])
const visitor = createVisitor(parser)

export type ParseError = ILexingError | exceptions.IRecognitionException

export function parse (input: string): { errors: ParseError[], ast?: RmsAst } {
  const { tokens, errors } = lex(input)
  if (errors.length) return { errors }

  parser.input = tokens
  const cst = parser.script()
  if (parser.errors.length) return { errors: parser.errors }

  return { ast: visitor.visit(cst), errors: [] }
}
