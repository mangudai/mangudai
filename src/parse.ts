import { Token, CstNode, CstChildrenDictionary } from 'chevrotain'
import { RmsCstParser } from './cst'
import { createVisitor } from './ast'

const parser = new RmsCstParser([])
const visitor = createVisitor(parser)

export function parse (tokens: Token[]) {
  parser.input = tokens
  const cst = parser.script()
  const ast = visitor.visit(cst)

  return {
    ast: ast,
    errors: parser.errors
  }
}
