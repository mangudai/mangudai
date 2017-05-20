import { Parser, ICstVisitor, CstChildrenDictionary, CstNode, Token } from 'chevrotain'

export type RmsAst = {
  type: 'Script',
  statements: RmsAstStatement[]
}

export type RmsAstStatement = RmsAstMultilineComment | RmsAstSectionHeader

export type RmsAstMultilineComment = {
  type: 'MultilineComment',
  comment: string
}

export type RmsAstSectionHeader = {
  type: 'SectionHeader',
  name: string
}

export function createVisitor (parser: Parser): ICstVisitor<undefined, RmsAst> {
  const BaseCstVisitor = parser.getBaseCstVisitorConstructor()

  class RmsToAstVisitor extends BaseCstVisitor {
    constructor () {
      super()
      this.validateVisitor()
    }

    script (ctx: CstChildrenDictionary): RmsAst {
      const statements = (ctx.statement as CstNode[]).map(s => this.visit(s))
      return {
        type: 'Script',
        statements
      }
    }

    statement (ctx: CstChildrenDictionary): RmsAstStatement {
      if (ctx.MultilineComment.length) {
        return {
          type: 'MultilineComment',
          comment: (ctx.MultilineComment[0] as Token).image
        }
      } else {
        return this.visit(ctx.sectionHeader[0] as CstNode)
      }
    }

    sectionHeader (ctx: CstChildrenDictionary): RmsAstSectionHeader {
      return {
        type: 'SectionHeader',
        name: (ctx.UpperIdentifier[0] as Token).image
      }
    }
  }

  return new RmsToAstVisitor()
}
