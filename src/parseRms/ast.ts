import { Parser, ICstVisitor, CstChildrenDictionary, CstNode, Token } from 'chevrotain'

export type RmsAst = {
  type: 'Script',
  statements: RmsTopLevelStatement[]
}

export type RmsTopLevelStatement = RmsSection | RmsConstDefinition | RmsFlagDefinition

export type RmsSection = {
  type: 'Section',
  name: string,
  statements: RmsSectionStatement[]
}

export type RmsSectionStatement = RmsCommand | RmsConstDefinition | RmsFlagDefinition

export type RmsCommand = {
  type: 'Command',
  name: string,
  value?: string | number,
  attributes?: RmsAttribute[]
}

export type RmsAttribute = {
  type: 'Attribute',
  name: string,
  value?: string | number
}

export type RmsConstDefinition = {
  type: 'ConstDefinition',
  name: string,
  value: number
}

export type RmsFlagDefinition = {
  type: 'FlagDefinition',
  flag: string
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
      if (ctx.section.length) return this.visit(ctx.section[0] as CstNode)
      if (ctx.const.length) return this.visit(ctx.const[0] as CstNode)
      return this.visit(ctx.define[0] as CstNode)
    }

    section (ctx: CstChildrenDictionary): RmsSection {
      return {
        type: 'Section',
        name: this.visit(ctx.sectionHeader[0] as CstNode),
        statements: (ctx.sectionStatement as CstNode[]).map(s => this.visit(s))
      }
    }

    sectionHeader (ctx: CstChildrenDictionary): string {
      return (ctx.Identifier[0] as Token).image
    }

    sectionStatement (ctx: CstChildrenDictionary): RmsSectionStatement {
      if (ctx.command.length) return this.visit(ctx.command[0] as CstNode)
      if (ctx.const.length) return this.visit(ctx.const[0] as CstNode)
      return this.visit(ctx.define[0] as CstNode)
    }

    command (ctx: CstChildrenDictionary): RmsCommand {
      const { name, value } = this.visit(ctx.attribute[0] as CstNode)
      const attributes = ctx.attributeList.length ? this.visit(ctx.attributeList[0] as CstNode) : undefined

      return { type: 'Command', name, value, attributes }
    }

    attribute (ctx: CstChildrenDictionary): RmsAttribute {
      return {
        type: 'Attribute',
        name: (ctx.Identifier[0] as Token).image,
        value: this.$parseAttributeValue(ctx)
      }
    }

    attributeList (ctx: CstChildrenDictionary): RmsAttribute[] {
      return (ctx.attribute as CstNode[]).map(s => this.visit(s))
    }

    const (ctx: CstChildrenDictionary): RmsConstDefinition {
      return {
        type: 'ConstDefinition',
        name: (ctx.Identifier[0] as Token).image,
        value: parseInt((ctx.Integer[0] as Token).image, 10)
      }
    }

    define (ctx: CstChildrenDictionary): RmsFlagDefinition {
      return {
        type: 'FlagDefinition',
        flag: (ctx.Identifier[0] as Token).image
      }
    }

    lineBreaks () {
      return
    }

    private $parseAttributeValue (ctx: CstChildrenDictionary): string | number | undefined {
      if (ctx.Identifier.length === 2) return (ctx.Identifier[1] as Token).image
      if (ctx.Integer.length) return parseInt((ctx.Integer[0] as Token).image, 10)
    }
  }

  return new RmsToAstVisitor()
}
