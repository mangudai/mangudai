import { Token, Parser } from 'chevrotain'
import { allTokenTypes, Whitespace, MultilineComment } from './lex'

export class RmsCstParser extends Parser {
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
