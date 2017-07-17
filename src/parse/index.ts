import { Parser, Grammar } from 'nearley'
import { Token } from 'moo'
import * as grammar from './grammar'
import { ruleNodesMiddleware } from './nearleyMiddleware'
import { toCst } from './cst'
import { toAst } from './ast'
import { Script } from './astTypes'
import { formatLexError } from './lexer'
import { getBoundaries, TextSpanError } from '../tokenHelpers'

export * from './astTypes'

const wrappedGrammar = { ...grammar, ParserRules: ruleNodesMiddleware(grammar.ParserRules) }
// TODO: Fix nearley.Grammar.fromCompiled() TypeScript definition.
const compiledGrammar: Grammar = (Grammar.fromCompiled as any)(wrappedGrammar)

export function parse (input: string): { errors: TextSpanError[], ast?: Script } {
  const parser = new Parser(compiledGrammar)
  try {
    parser.feed(input)
    const parsings = parser.results.map(toCst).map(toAst)
    if (parsings.length > 1) {
      throw new Error('Ambiguous grammar! This is likely a problem with Mangudai itself, ' +
        'not your script. Please report this issue along with the script that caused it.')
    }
    return {
      ast: parsings[0],
      errors: []
    }
  } catch (error) {
    let errorWithTextSpan: TextSpanError
    if (error && error.token && error.token.type === 'invalid') {
      errorWithTextSpan = formatLexError(error)
    } else if (error && error.token) {
      errorWithTextSpan = formatParseError(error)
    } else {
      errorWithTextSpan = {
        name: 'ParseError',
        message: error && error.message,
        boundaries: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 1 }
        }
      }
    }
    return {
      errors: [errorWithTextSpan]
    }
  }
}

export function formatParseError (err: Error & { token: Token }): TextSpanError {
  return {
    name: 'ParseError',
    message: `Unexpected token ${err.token.type}: '${err.token.value}'.`,
    boundaries: getBoundaries(err.token)
  }
}
