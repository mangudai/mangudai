import { Parser, ICstVisitor, CstChildrenDictionary, CstNode, Token } from 'chevrotain'

export function createVisitor (parser: Parser): ICstVisitor<undefined, {}> {
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

  return new RmsToAstVisitor()
}
