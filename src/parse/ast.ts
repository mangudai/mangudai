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
      return {
        type: 'Script',
        statements
      }
    }

    private statement (ctx: CstChildrenDictionary) {
      if (ctx.MultilineComment.length) {
        return {
          type: 'MultilineComment',
          comment: (ctx.MultilineComment[0] as Token).image
        }
      } else if (ctx.sectionHeader.length) {
        return this.visit(ctx.sectionHeader[0] as CstNode)
      }
    }

    private sectionHeader (ctx: CstChildrenDictionary) {
      const result = {
        type: 'SectionHeader',
        name: (ctx.UpperIdentifier[0] as Token).image
      }
      return result
    }
  }

  return new RmsToAstVisitor()
}
