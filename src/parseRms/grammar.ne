@preprocessor typescript

@{%
  import { compile } from 'moo'
  import { RmsAst, RmsIf, RmsTopLevelStatement, RmsSection, RmsSectionStatement,
    RmsCommand, RmsCommandStatement, RmsAttribute, RmsConstDefinition, RmsFlagDefinition } from './index'

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

GenericIf[Child] -> %If ws identifier __
                    ($Child eol):*
                    (%Elseif ws identifier __ ($Child eol):*):*
                    (%Else __ ($Child eol):+):?
                    %Endif
  {% ([, , condition, , statements, elseifs, elseStatements]): RmsIf<any> => {
    const node: RmsIf<any> = { type: 'If', condition }
    if (statements.length) node.statements = statements.map((s: any) => s[0][0])
    if (elseifs.length) node.elseifs = elseifs.map(([, , condition, , statements]: any) => {
      const obj: { condition: string, statements?: any[] } = { condition }
      if (statements.length) obj.statements = statements.map((s: any) => s[0][0])
      return obj
    })
    if (elseStatements) node.elseStatements = elseStatements[2].map((s: any) => s[0][0])
    return node
  } %}

TopLevelStatement -> (Section | ConstDefinition | FlagDefinition | TopLevelIf)
  {% ([[statement]]): RmsTopLevelStatement => statement %}

TopLevelIf -> GenericIf[TopLevelStatement]
  {% id %}

Section -> %LArrow identifier %RArrow eol (SectionStatement eol):* SectionStatement
  {% ([, name, , , statements, last]): RmsSection => ({
    type: 'Section',
    name,
    statements: combineLast(statements, last)
  }) %}

SectionStatement -> (Command | ConstDefinition | FlagDefinition | SectionIf)
  {% ([[statement]]): RmsSectionStatement => statement %}

SectionIf -> GenericIf[SectionStatement]
  {% id %}

Command -> Attribute (_ %LCurly eol? ((CommandStatement eol):* CommandStatement eol?):? %RCurly):?
  {% ([attr, statements]): RmsCommand => {
    const node: RmsCommand = { type: 'Command', name: attr.name }
    if (attr.value) node.value = attr.value
    if (statements && statements[3]) node.statements = combineLast(statements[3][0], statements[3][1])
    else if (statements) node.statements = []
    return node
  } %}

CommandStatement -> (Attribute | CommandIf)
  {% ([[statement]]): RmsCommandStatement => statement %}

CommandIf -> GenericIf[CommandStatement]
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
int -> %Integer           {% ([token]) => parseInt(token.value, 10) %}
identifier -> %Identifier {% ([token]) => token.value %}

eol  -> (%LineBreak | %MultilineComment):* %LineBreak (%LineBreak | %MultilineComment):* {% () => null %}
eol? -> eol:?                                       {% () => null %}
ws   -> %Space                                      {% () => null %}
ws?  -> ws:?                                        {% () => null %}
__   -> (%LineBreak | %Space | %MultilineComment):+ {% () => null %}
_    -> __:?                                        {% () => null %}
