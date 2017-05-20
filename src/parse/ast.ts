import { Parser, ICstVisitor, CstChildrenDictionary, CstNode, Token } from 'chevrotain'

export type RmsAst = {
  type: 'Script',
  statements: RmsTopLevelStatement[]
}

export type RmsTopLevelStatement = RmsSection | RmsConstDefinition

export type RmsSection = {
  type: 'Section',
  name: string,
  statements: RmsSectionStatement[]
}

export type RmsSectionStatement = RmsSimpleProperty | RmsPropertyBlock | RmsConstDefinition

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

export type RmsConstDefinition = {
  type: 'ConstDefinition',
  name: string,
  value: number
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
        statements: (ctx.topLevelStatement as CstNode[]).map(s => this.visit(s))
      }
    }

    topLevelStatement (ctx: CstChildrenDictionary): RmsTopLevelStatement {
      return ctx.section.length ?
        this.visit(ctx.section[0] as CstNode) :
        this.visit(ctx.const[0] as CstNode)
    }

    section (ctx: CstChildrenDictionary): RmsSection {
      return {
        type: 'Section',
        name: this.visit(ctx.sectionHeader[0] as CstNode),
        statements: (ctx.sectionStatement as CstNode[]).map(s => this.visit(s))
      }
    }

    sectionHeader (ctx: CstChildrenDictionary): string {
      return (ctx.UpperIdentifier[0] as Token).image
    }

    sectionStatement (ctx: CstChildrenDictionary): RmsSectionStatement {
      if (ctx.propertyBlock.length) return this.visit(ctx.propertyBlock[0] as CstNode)
      else if (ctx.simpleProperty.length) return this.visit(ctx.simpleProperty[0] as CstNode)
      else return this.visit(ctx.const[0] as CstNode)
    }

    simpleProperty (ctx: CstChildrenDictionary): RmsSimpleProperty {
      let value = undefined
      if (ctx.Integer.length) value = parseInt((ctx.Integer[0] as Token).image, 10)
      else if (ctx.UpperIdentifier.length) value = (ctx.UpperIdentifier[0] as Token).image

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

    const (ctx: CstChildrenDictionary): RmsConstDefinition {
      return {
        type: 'ConstDefinition',
        name: (ctx.UpperIdentifier[0] as Token).image,
        value: parseInt((ctx.Integer[0] as Token).image, 10)
      }
    }
  }

  return new RmsToAstVisitor()
}
