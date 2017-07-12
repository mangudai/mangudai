import { Token, Lexer } from 'chevrotain'

/* tslint:disable:no-multi-spaces */
export class Eol              extends Token { static PATTERN = /\s*\n\s*/; static LINE_BREAKS = true }
export class Space            extends Token { static PATTERN = /[\t ]+/ }
export class Int              extends Token { static PATTERN = /\b[0-9]+\b/ }
export class Identifier       extends Token { static PATTERN = /\b[^\s!@#\$%\^&\*\(\)\-\+=;:'"<>{}\[\]\?\/\\][^\s;'"<>{}\[\]\/\\]*\b/ }
export class MultilineComment extends Token { static PATTERN = /\/\*[\s\S]*?\*\//; static LINE_BREAKS = true }
export class LArrow           extends Token { static PATTERN = /</ }
export class RArrow           extends Token { static PATTERN = />/ }
export class LCurly           extends Token { static PATTERN = /{/ }
export class RCurly           extends Token { static PATTERN = /}/ }
export class ConstToken       extends Token { static PATTERN = /#const/ }
export class Define           extends Token { static PATTERN = /#define/ }
export class IncludeDrs       extends Token { static PATTERN = /#include_drs/ }
export class If               extends Token { static PATTERN = /if/; static LONGER_ALT = Identifier }
export class Elseif           extends Token { static PATTERN = /elseif/; static LONGER_ALT = Identifier }
export class Else             extends Token { static PATTERN = /else/; static LONGER_ALT = Identifier }
export class Endif            extends Token { static PATTERN = /endif/; static LONGER_ALT = Identifier }
export class StartRandom      extends Token { static PATTERN = /start_random/; static LONGER_ALT = Identifier }
export class PercentChance    extends Token { static PATTERN = /percent_chance/; static LONGER_ALT = Identifier }
export class EndRandom        extends Token { static PATTERN = /end_random/; static LONGER_ALT = Identifier }
/* tslint:enable:no-multi-spaces */

export const tokenTypes = [ Eol, Space, MultilineComment, LArrow, RArrow, LCurly, RCurly, ConstToken, Define, IncludeDrs,
  If, Elseif, Else, Endif, StartRandom, PercentChance, EndRandom, Int, Identifier ]

export const lexer = new Lexer(tokenTypes)
