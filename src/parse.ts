import { Token, CstNode, CstChildrenDictionary } from 'chevrotain'
import { RmsCstParser } from './cst'

const parser = new RmsCstParser([])

const BaseCstVisitor = parser.getBaseCstVisitorConstructor()

class RmsToAstVisitor extends BaseCstVisitor {
  constructor () {
    super()
    this.validateVisitor()
  }

  private script (ctx: CstChildrenDictionary) {
    const statements = (ctx.statement as CstNode[]).map(s => this.visit(s))
    return statements
  }

  private statement (ctx: CstChildrenDictionary) {
    if ('MultilineComment' in ctx) {
      return {
        type: 'MultilineComment',
        comment: (ctx.MultilineComment[0] as Token).image
      }
    }
  }
}

const visitor = new RmsToAstVisitor()

export function parse (tokens: Token[]) {
  parser.input = tokens
  const cst = parser.script()
  const ast = visitor.visit(cst)

  return {
    ast: ast,
    errors: parser.errors
  }
}
