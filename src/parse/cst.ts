import { Token, Parser } from 'chevrotain'
import { allTokenTypes, LineBreak, LArrow, RArrow, LCurly, RCurly, Const, Define, Identifier, Integer } from './lex'

export class RmsCstParser extends Parser {
  public script = this.RULE('script', () => {
    this.OPTION(() => { this.SUBRULE(this.lineBreaks) })
    this.MANY(() => { this.SUBRULE(this.topLevelStatement) })
  })

  private topLevelStatement = this.RULE('topLevelStatement', () => {
    this.OR([
      { ALT: () => { this.SUBRULE(this.section) } },
      { ALT: () => { this.SUBRULE(this.define) } },
      { ALT: () => { this.SUBRULE(this.const) } }
    ])
  })

  private section = this.RULE('section', () => {
    this.SUBRULE(this.sectionHeader)
    this.AT_LEAST_ONE(() => { this.SUBRULE(this.sectionStatement) })
  })

  private sectionHeader = this.RULE('sectionHeader', () => {
    this.CONSUME(LArrow)
    this.CONSUME(Identifier)
    this.CONSUME(RArrow)
    this.SUBRULE(this.lineBreaks)
  })

  private sectionStatement = this.RULE('sectionStatement', () => {
    this.OR([
      { ALT: () => { this.SUBRULE(this.property) } },
      { ALT: () => { this.SUBRULE(this.define) } },
      { ALT: () => { this.SUBRULE(this.const) } }
    ])
  })

  private property = this.RULE('property', () => {
    this.SUBRULE(this.attribute)
    this.OPTION(() => { this.SUBRULE(this.propertyBlock) })
    this.SUBRULE(this.lineBreaks)
  })

  private propertyBlock = this.RULE('propertyBlock', () => {
    this.OPTION(() => { this.CONSUME1(LineBreak) })
    this.CONSUME(LCurly)
    this.CONSUME2(LineBreak)
    this.AT_LEAST_ONE(() => { this.SUBRULE(this.attribute); this.CONSUME3(LineBreak) })
    this.CONSUME(RCurly)
  })

  private attribute = this.RULE('attribute', () => {
    this.OR([
      { ALT: () => { this.CONSUME1(Identifier); this.CONSUME2(Identifier) } },
      { ALT: () => { this.CONSUME3(Identifier); this.CONSUME(Integer) } },
      { ALT: () => { this.CONSUME4(Identifier) } }
    ])
  })

  private const = this.RULE('const', () => {
    this.CONSUME(Const)
    this.CONSUME(Identifier)
    this.CONSUME(Integer)
    this.SUBRULE(this.lineBreaks)
  })

  private define = this.RULE('define', () => {
    this.CONSUME(Define)
    this.CONSUME(Identifier)
    this.SUBRULE(this.lineBreaks)
  })

  private lineBreaks = this.RULE('lineBreaks', () => {
    this.AT_LEAST_ONE(() => { this.CONSUME(LineBreak) })
  })

  constructor (input: Token[]) {
    super(input, allTokenTypes, { outputCst: true })
    Parser.performSelfAnalysis(this)
  }
}
