import { Token, Parser } from 'chevrotain'
import { allTokenTypes, LArrow, RArrow, LCurly, RCurly, Const, UpperIdentifier, LowerIdentifier, Integer } from './lex'

export class RmsCstParser extends Parser {
  public script = this.RULE('script', () => {
    this.MANY(() => { this.SUBRULE(this.topLevelStatement) })
  })

  private topLevelStatement = this.RULE('topLevelStatement', () => {
    this.OR([
      { ALT: () => { this.SUBRULE(this.section) } },
      { ALT: () => { this.SUBRULE(this.const) } }
    ])
  })

  private section = this.RULE('section', () => {
    this.SUBRULE(this.sectionHeader)
    this.AT_LEAST_ONE(() => { this.SUBRULE(this.sectionStatement) })
  })

  private sectionHeader = this.RULE('sectionHeader', () => {
    this.CONSUME(LArrow)
    this.CONSUME(UpperIdentifier)
    this.CONSUME(RArrow)
  })

  private sectionStatement = this.RULE('sectionStatement', () => {
    this.OR([
      { ALT: () => { this.SUBRULE(this.propertyBlock) } },
      { ALT: () => { this.SUBRULE(this.simpleProperty) } },
      { ALT: () => { this.SUBRULE(this.const) } }
    ])
  })

  private propertyBlock = this.RULE('propertyBlock', () => {
    this.SUBRULE1(this.simpleProperty)
    this.CONSUME(LCurly)
    this.AT_LEAST_ONE(() => { this.SUBRULE2(this.simpleProperty) })
    this.CONSUME(RCurly)
  })

  private simpleProperty = this.RULE('simpleProperty', () => {
    this.CONSUME(LowerIdentifier)
    this.OPTION(() => {
      this.OR([
        { ALT: () => { this.CONSUME(Integer) } },
        { ALT: () => { this.CONSUME(UpperIdentifier) } }
      ])
    })
  })

  private const = this.RULE('const', () => {
    this.CONSUME(Const)
    this.CONSUME(UpperIdentifier)
    this.CONSUME(Integer)
  })

  constructor (input: Token[]) {
    super(input, allTokenTypes, { outputCst: true })
    Parser.performSelfAnalysis(this)
  }
}
