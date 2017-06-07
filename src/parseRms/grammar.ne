@preprocessor typescript

@{%
  import { compile } from 'moo'
  import { RmsAst, RmsTopLevelStatement, RmsSection, RmsSectionStatement,
    RmsCommand, RmsAttribute, RmsConstDefinition, RmsFlagDefinition } from './index'

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
  {% ([, statements]): RmsAst => ({
    type: 'RandomMapScript',
    statements: statements ? combineLast(statements[0], statements[1]) : []
  }) %}

TopLevelStatement -> (Section | ConstDefinition | FlagDefinition)
  {% ([[statement]]): RmsTopLevelStatement => statement %}

Section -> %LArrow identifier %RArrow eol (SectionStatement eol):* SectionStatement
  {% ([, name, , , statements, last]): RmsSection => ({
    type: 'Section',
    name,
    statements: combineLast(statements, last)
  }) %}

SectionStatement -> (Command | ConstDefinition | FlagDefinition)
  {% ([[statement]]): RmsSectionStatement => statement %}

Command -> Attribute (_ %LCurly eol? ((CommandStatement eol):* CommandStatement eol?):? %RCurly):?
  {% ([attr, statements]): RmsCommand => {
    const node: RmsCommand = { type: 'Command', name: attr.name }
    if (attr.value) node.value = attr.value
    if (statements && statements[3]) node.attributes = combineLast(statements[3][0], statements[3][1])
    else if (statements) node.attributes = []
    return node
  } %}

CommandStatement -> Attribute
  {% id %}

Attribute -> identifier (ws (identifier | int)):?
  {% ([name, value]): RmsAttribute => {
    const node: RmsAttribute = { type: 'Attribute', name }
    if (value) node.value = value[1][0]
    return node
  } %}

ConstDefinition -> %Const ws identifier ws int
  {% ([, , name, , value]): RmsConstDefinition => ({
    type: 'ConstDefinition',
    name,
    value
  }) %}

FlagDefinition -> %Define ws identifier
  {% ([, , flag]): RmsFlagDefinition => ({
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
