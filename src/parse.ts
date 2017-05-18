import { Token, Parser, IParserConfig, CstNode, CstChildrenDictionary } from 'chevrotain'
import { lex, allTokenTypes, Whitespace, MultilineComment } from './lex'

class RmsCstParser extends Parser {
  public script = this.RULE('script', () => {
    this.OPTION(() => { this.CONSUME1(Whitespace) })
    this.MANY_SEP({
      SEP: Whitespace,
      DEF: () => { this.SUBRULE(this.statement) }
    })
    this.OPTION2(() => { this.CONSUME2(Whitespace) })
  })

  private statement = this.RULE('statement', () => {
    this.OR([
      { ALT: () => { this.CONSUME(MultilineComment) }}
    ])
  })

  constructor (input: Token[]) {
    super(input, allTokenTypes, { outputCst: true })
    Parser.performSelfAnalysis(this)
  }
}

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
