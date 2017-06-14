import { Parser } from 'nearley'
import { Lexer, ParserRules, ParserStart } from './grammar'
import { visitorMiddleware, rejectMiddleware } from './nearleyMiddleware'
import { cstToAstVisitor } from './ast'
import { RmsAst, RmsSection } from './astTypes'

export * from './astTypes'

visitorMiddleware(ParserRules, cstToAstVisitor)
// Eliminate ambiguity: reject parsings with const/define/comment as the last section statement,
// as it's usually intended to be a top-level statement instead and we have to decide one way or another.
rejectMiddleware(ParserRules, {
  Script: (ast: RmsAst) => {
    let hasGreedySections = ast.statements
      .filter(x => x.type === 'Section')
      .some(({ statements }: RmsSection) => ['ConstDefinition', 'FlagDefinition', 'MultilineComment']
        .includes((statements.slice(-1).pop() || {} as any).type))
    return hasGreedySections
  }
})

export function parse (input: string): { errors: Object[], ast?: RmsAst } {
  const parser = new Parser(ParserRules, ParserStart, { lexer: Lexer })
  try {
    parser.feed(input)
    if (parser.results.length > 1) {
      throw new Error('Ambiguous grammar! This is likely a problem with Mangudai itself, ' +
        'not your script. Please report this issue along with the script that caused it.')
    }
    return {
      ast: parser.results[0],
      errors: []
    }
  } catch (error) {
    return {
      errors: [error]
    }
  }
}
