import { Token, Lexer } from 'chevrotain'

export class RArrow extends Token { static PATTERN = />/ }
export class LArrow extends Token { static PATTERN = /</ }
export class LCurly extends Token { static PATTERN = /{/ }
export class RCurly extends Token { static PATTERN = /}/ }
export class Hash extends Token { static PATTERN = /#/ }
export class LowerIdentifier extends Token { static PATTERN = /[a-z_]+/ }
export class UpperIdentifier extends Token { static PATTERN = /[A-Z_]+/ }
export class Number extends Token { static PATTERN = /[0-9]+/ }

export class Whitespace extends Token { static PATTERN = /\s+/; static GROUP = Lexer.SKIPPED }
export class Semicolon extends Token { static PATTERN = /;/ }
export class MultilineComment extends Token { static PATTERN = /\/\*[\s\S]*?\*\//; static GROUP = Lexer.SKIPPED }

export const allTokenTypes: typeof Token[] = [RArrow, LArrow, LCurly, RCurly, Hash, LowerIdentifier,
  UpperIdentifier, Number, Whitespace, Semicolon, MultilineComment]

const lexer = new Lexer(allTokenTypes)

export function lex (inputText: string) {
  return lexer.tokenize(inputText)
}
