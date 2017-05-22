import { Token, Lexer } from 'chevrotain'
import * as XRegExp from 'xregexp'

export class RArrow extends Token { static PATTERN = />/ }
export class LArrow extends Token { static PATTERN = /</ }
export class LCurly extends Token { static PATTERN = /{/ }
export class RCurly extends Token { static PATTERN = /}/ }
export class Const extends Token { static PATTERN = /#const/ }
export class Define extends Token { static PATTERN = /#define/ }
export class Integer extends Token { static PATTERN = /[0-9]+/ }
export class Identifier extends Token { static PATTERN = XRegExp('[\\p{Letter}-_]+') }

export class LineBreak extends Token { static PATTERN = /\s*\n\s*/ }
export class Space extends Token { static PATTERN = /[\t ]+/; static GROUP = Lexer.SKIPPED }
export class MultilineComment extends Token { static PATTERN = /\/\*[\s\S]*?\*\//; static GROUP = Lexer.SKIPPED }

export const allTokenTypes: typeof Token[] = [LineBreak, Space, MultilineComment, RArrow, LArrow, LCurly, RCurly,
  Const, Define, Integer, Identifier]

const lexer = new Lexer(allTokenTypes)

export function lex (inputText: string) {
  return lexer.tokenize(inputText)
}
