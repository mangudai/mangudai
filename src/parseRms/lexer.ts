import { compile } from 'moo'

export const lexer = compile({
  LineBreak: { match: /\s*\n\s*/, lineBreaks: true },
  Space: /[\t ]+/,
  MultilineComment: { match: /\/\*[\s\S]*?\*\//, lineBreaks: true },
  LArrow: '<',
  RArrow: '>',
  LCurly: '{',
  RCurly: '}',
  Const: '#const',
  Define: '#define',
  IncludeDrs: '#include_drs',
  If: 'if',
  Elseif: 'elseif',
  Else: 'else',
  Endif: 'endif',
  StartRandom: 'start_random',
  PercentChance: 'percent_chance',
  EndRandom: 'end_random',
  Integer: /\b[0-9]+\b/,
  Identifier: /\b[^\s!@#\$%\^&\*\(\)\-\+=;:'"<>{}\[\]\?\/\\][^\s;'"<>{}\[\]\/\\]*\b/
})
