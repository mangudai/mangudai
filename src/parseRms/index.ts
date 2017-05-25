import { lex } from './lex'
import { RmsCstParser } from './cst'
import { createVisitor } from './ast'

const parser = new RmsCstParser([])
const visitor = createVisitor(parser)

export function parse (input: string) {
  const { tokens, errors: lexerErrors } = lex(input)
  parser.input = tokens
  const cst = parser.script()
  const ast = visitor.visit(cst)

  return {
    ast,
    errors: {
      lexer: lexerErrors,
      parser: parser.errors
    }
  }
}
