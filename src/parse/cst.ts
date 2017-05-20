import { Token, Parser } from 'chevrotain'
import { allTokenTypes, Whitespace, LArrow, RArrow, UpperIdentifier } from './lex'

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
      { ALT: () => { this.SUBRULE(this.sectionHeader) }}
    ])
  })

  private sectionHeader = this.RULE('sectionHeader', () => {
    this.CONSUME(LArrow)
    this.CONSUME(UpperIdentifier)
    this.CONSUME(RArrow)
  })

  constructor (input: Token[]) {
    super(input, allTokenTypes, { outputCst: true })
    Parser.performSelfAnalysis(this)
  }
}
