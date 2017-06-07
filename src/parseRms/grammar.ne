@preprocessor typescript

@{%
  import { compile } from 'moo'

  const lexer = compile({
    LineBreak: { match: /\s*\n\s*/, lineBreaks: true },
    Space: /[\t ]+/,
    MultilineComment: { match: /\/\*[\s\S]*?\*\//, lineBreaks: true },
    LArrow: '<',
    RArrow: '>',
    LCurly: '{',
    RCurly: '}',
    Const: '#const',
    Define: '#define',
    If: 'if',
    Elseif: 'elseif',
    Else: 'else',
    Endif: 'endif',
    Integer: /[0-9]+/,
    Identifier: require('xregexp')('[\\p{Letter}-_]+')
  })

  // Extract flat array of rule results from this: (rule __):* rule
  const combineLast = (many: any[], last: any) => many.map(x => x[0]).concat([last])
%}

@lexer lexer

Script -> _ ((TopLevelStatement eol):* TopLevelStatement eol?):?
  {% ([, statements]) => ({
    type: 'RandomMapScript',
    statements: statements ? combineLast(statements[0], statements[1]) : []
  }) %}

TopLevelStatement -> (Section | ConstDefinition | FlagDefinition)
  {% ([[statement]]) => statement %}

Section -> %LArrow identifier %RArrow eol (SectionStatement eol):* SectionStatement
  {% ([, name, , , statements, last]) => ({
    type: 'Section',
    name,
    statements: combineLast(statements, last)
  }) %}

SectionStatement -> (Command | ConstDefinition | FlagDefinition)
  {% ([[statement]]) => statement %}

Command -> Attribute (_ %LCurly eol? ((CommandStatement eol):* CommandStatement eol?):? %RCurly):?
  {% ([attr, statements]) => ({
    type: 'Command',
    name: attr.name,
    value: attr.value,
    attributes: (statements && statements[3]) ? combineLast(statements[3][0], statements[3][1]) : undefined
  }) %}

CommandStatement -> Attribute
  {% id %}

Attribute -> identifier (ws (identifier | int)):?
  {% ([name, optionalValue]) => ({
    type: 'Attribute',
    name,
    value: optionalValue ? optionalValue[1][0] : undefined
  }) %}

ConstDefinition -> %Const ws identifier ws int
  {% ([, , name, , value]) => ({
    type: 'ConstDefinition',
    name,
    value
  }) %}

FlagDefinition -> %Define ws identifier
  {% ([, , flag]) => ({
    type: 'FlagDefinition',
    flag
  }) %}

# ==============================================================================
# Terminals
# ==============================================================================
int -> %Integer           {% ([token]) => parseInt(token.value) %}
identifier -> %Identifier {% ([token]) => token.value %}

eol  -> (%LineBreak | %MultilineComment):* %LineBreak (%LineBreak | %MultilineComment):* {% () => null %}
eol? -> eol:?                                       {% () => null %}
ws   -> %Space                                      {% () => null %}
ws?  -> ws:?                                        {% () => null %}
__   -> (%LineBreak | %Space | %MultilineComment):+ {% () => null %}
_    -> __:?                                        {% () => null %}
