@preprocessor typescript

@{%
  import { compile } from 'moo'

  const lexer = compile({
    LineBreak: { match: /\s*\n\s*/, lineBreaks: true },
    Space: /[\t ]+/,
    MultilineComment: /\/\*[\s\S]*?\*\//,
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

Script -> _ (TopLevelStatement eol):* TopLevelStatement
  {% parts => ({
    type: 'Script',
    statements: combineLast(parts[1], parts[2])
  }) %}

TopLevelStatement -> Section
  {% id %}

Section -> %LArrow %Identifier %RArrow eol (SectionStatement eol):* SectionStatement
  {% parts => ({
    type: 'Section',
    name: parts[1],
    statements: combineLast(parts[4], parts[5])
  }) %}

SectionStatement -> Command
  {% id %}

Command -> Attribute (_ %LCurly eol (CommandStatement eol):* CommandStatement eol %RCurly):?
  {% parts => ({
    type: 'Command',
    name: parts[0].name,
    value: parts[0].value,
    attributes: parts[1].length ? combineLast(parts[1][3], parts[1][4]) : undefined
  }) %}

CommandStatement -> Attribute
  {% id %}

Attribute -> %Identifier (ws (%Identifier | int)):?
  {% parts => ({
    type: 'Attribute',
    name: parts[0],
    value: parts[1][1]
  }) %}

# ==============================================================================
# Terminals
# ==============================================================================
int -> %Integer           {% parts => parseInt(parts[0]) %}

eol ->  %LineBreak        {% () => null %}
eol? -> eol:?             {% () => null %}
ws ->  %Space             {% () => null %}
ws? -> ws:?               {% () => null %}
__ -> %LineBreak | %Space {% () => null %}
_ ->  __:?                {% () => null %}
