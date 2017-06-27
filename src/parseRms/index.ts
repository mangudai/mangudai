import { Parser } from 'nearley'
import { Lexer, ParserRules, ParserStart } from './grammar'
import { ruleNodesMiddleware } from './nearleyMiddleware'
import { toCst, isNotAmbiguousCst } from './cst'
import { toAst } from './ast'
import { RmsAst } from './astTypes'

export * from './astTypes'

const wrappedRules = ruleNodesMiddleware(ParserRules)

export function parse (input: string): { errors: Object[], ast?: RmsAst } {
  const parser = new Parser(wrappedRules, ParserStart, { lexer: Lexer })
  try {
    parser.feed(input)
    const parsings = parser.results.map(toCst).filter(isNotAmbiguousCst).map(toAst)
    if (parsings.length > 1) {
      throw new Error('Ambiguous grammar! This is likely a problem with Mangudai itself, ' +
        'not your script. Please report this issue along with the script that caused it.')
    }
    return {
      ast: parsings[0],
      errors: []
    }
  } catch (error) {
    return {
      errors: [error]
    }
  }
}
