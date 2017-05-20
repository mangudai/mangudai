import { Parser, ICstVisitor, CstChildrenDictionary, CstNode, Token } from 'chevrotain'

export type RmsAst = {
  type: 'Script',
  sections: RmsSection[]
}

export type RmsSection = {
  type: 'Section',
  name: string,
  properties: RmsProperty[]
}

export type RmsProperty = RmsSimpleProperty | RmsPropertyBlock

export type RmsSimpleProperty = {
  type: 'SimpleProperty',
  name: string,
  value?: string | number
}

export type RmsPropertyBlock = {
  type: 'PropertyBlock',
  name: string,
  value?: string | number,
  properties: RmsSimpleProperty[]
}

export function createVisitor (parser: Parser): ICstVisitor<undefined, RmsAst> {
  const BaseCstVisitor = parser.getBaseCstVisitorConstructor()

  class RmsToAstVisitor extends BaseCstVisitor {
    constructor () {
      super()
      this.validateVisitor()
    }

    script (ctx: CstChildrenDictionary): RmsAst {
      return {
        type: 'Script',
        sections: (ctx.section as CstNode[]).map(s => this.visit(s))
      }
    }

    section (ctx: CstChildrenDictionary): RmsSection {
      return {
        type: 'Section',
        name: this.visit(ctx.sectionHeader[0] as CstNode),
        properties: (ctx.property as CstNode[]).map(s => this.visit(s))
      }
    }

    sectionHeader (ctx: CstChildrenDictionary): string {
      return (ctx.UpperIdentifier[0] as Token).image
    }

    property (ctx: CstChildrenDictionary): RmsProperty {
      return ctx.simpleProperty.length ?
        this.visit(ctx.simpleProperty[0] as CstNode) :
        this.visit(ctx.propertyBlock[0] as CstNode)
    }

    simpleProperty (ctx: CstChildrenDictionary): RmsSimpleProperty {
      let value = undefined
      if (ctx.Integer.length) {
        value = parseInt((ctx.Integer[0] as Token).image, 10)
      } else if (ctx.UpperIdentifier.length) {
        value = (ctx.UpperIdentifier[0] as Token).image
      }

      return {
        type: 'SimpleProperty',
        name: (ctx.LowerIdentifier[0] as Token).image,
        value
      }
    }

    propertyBlock (ctx: CstChildrenDictionary): RmsPropertyBlock {
      let [base, ...properties] = (ctx.simpleProperty as CstNode[]).map(s => this.visit(s)) as RmsSimpleProperty[]
      return {
        type: 'PropertyBlock',
        name: base.name,
        value: base.value,
        properties: properties
      }
    }
  }

  return new RmsToAstVisitor()
}
