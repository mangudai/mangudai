import { compile, Token } from 'moo'
import { getBoundaries, TextSpanError } from '../tokenHelpers'

export const lexer = compile({
  eol: { match: /\s*\n\s*/, lineBreaks: true },
  space: /[\t ]+/,
  multilineComment: { match: /\/\*[\s\S]*?\*\//, lineBreaks: true },
  lArrow: '<',
  rArrow: '>',
  lCurly: '{',
  rCurly: '}',
  constToken: '#const',
  define: '#define',
  includeDrs: '#include_drs',
  ifToken: 'if',
  elseifToken: 'elseif',
  elseToken: 'else',
  endifToken: 'endif',
  startRandom: 'start_random',
  percentChance: 'percent_chance',
  endRandom: 'end_random',
  int: /\b[0-9]+\b/,
  identifier: /[^\s!@#\$%\^&\*\(\)\-\+=;:'"<>{}\[\]\?\/\\][^\s;'"<>{}\[\]\/\\]*/,
  invalid: { error: true } as any
})

export function formatLexError (err: Error & { token: Token }): TextSpanError {
  // When moo gets an unknown token, it gives up and returns
  // everything to eof as a single 'invalid' token. Let's at least separate the first word.
  let invalidTokenEndIndex = Math.min(err.token.value.length, ...[' ', '\r\n', '\n']
    .map(x => err.token.value.indexOf(x))
    .filter(x => x !== -1))
  let invalidTokenEndCol = err.token.col + invalidTokenEndIndex

  return {
    name: 'ParseError',
    message: `Unable to parse '${err.token.value.slice(0, invalidTokenEndIndex)}'.`,
    boundaries: {
      start: getBoundaries(err.token).start,
      end: {
        line: getBoundaries(err.token).start.line,
        col: invalidTokenEndCol
      }
    }
  }
}
