import { compile } from 'moo'

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
  identifier: /\b[^\s!@#\$%\^&\*\(\)\-\+=;:'"<>{}\[\]\?\/\\][^\s;'"<>{}\[\]\/\\]*\b/
})
