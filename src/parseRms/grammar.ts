import { Token, Parser } from 'chevrotain'
import { tokenTypes } from './lexer'
import * as tt from './lexer'

export class RmsParser extends Parser {
  public script = this.RULE('script', () => {
    this.OPTION1(() => { this.SUBRULE1(this.ws) })
  })

  public ws = this.RULE('__', () => {
    this.AT_LEAST_ONE1(() => {
      this.OR1([
        { ALT: () => { this.CONSUME1(tt.Eol) } },
        { ALT: () => { this.CONSUME1(tt.Space) } }
      ])
    })
  })

  constructor (input: Token[]) {
    super(input, tokenTypes)
    Parser.performSelfAnalysis(this)
  }
}
