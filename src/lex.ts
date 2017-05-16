import { Token, Lexer } from 'chevrotain'

class RArrow extends Token { static PATTERN = />/ }
class LArrow extends Token { static PATTERN = /</ }
class LCurly extends Token { static PATTERN = /{/ }
class RCurly extends Token { static PATTERN = /}/ }
class Hash extends Token { static PATTERN = /#/ }
class LowerIdentifier extends Token { static PATTERN = /[a-z_]+/ }
class UpperIdentifier extends Token { static PATTERN = /[A-Z_]+/ }
class Number extends Token { static PATTERN = /[0-9]+/ }

class Whitespace extends Token { static PATTERN = /\s+/ }
class Semicolon extends Token { static PATTERN = /;/ }
class Comment extends Token { static PATTERN = /\/\*[\s\S]*?\*\// }

export const allTokenTypes: typeof Token[] = [RArrow, LArrow, LCurly, RCurly, Hash, LowerIdentifier,
  UpperIdentifier, Number, Whitespace, Semicolon, Comment]

const lexer = new Lexer(allTokenTypes)

export function lex (inputText: string) {
  return lexer.tokenize(inputText)
}
