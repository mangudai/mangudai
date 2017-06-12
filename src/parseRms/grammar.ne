@preprocessor typescript

@{%
  import { compile } from 'moo'
  import { Parser } from 'nearley'
  import { RmsAst, RmsIf, RmsTopLevelStatement, RmsSection, RmsSectionStatement, RmsCommand, RmsCommandStatement,
    RmsAttribute, RmsConstDefinition, RmsFlagDefinition, RmsMultilineComment } from './index'

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
    Identifier: /[^\s0-9!@#\$%\^&\*\(\)\-\+=;:'"<>{}\[\]\?\/\\][^\s;'"<>{}\[\]\/\\]*/
  })

  // Extract flat array of rule results from this: (rule __):* rule
  const combineLast = (many: any[], last: any) => many.map(x => x[0]).concat([last])

  const flatten = <T>(arrays: T[][]): T[] => ([] as T[]).concat(...arrays)

  // Eliminate ambiguity: reject parsings with const/define/comment as the last section statement,
  // as it's usually intended to be a top-level statement instead and we have to decide one way or another.
  const validateAst = (ast: RmsAst): boolean => {
    let hasGreedySections = ast.statements
      .filter(x => x.type === 'Section')
      .some(({ statements }: RmsSection) => ['ConstDefinition', 'FlagDefinition', 'MultilineComment']
        .includes((statements.slice(-1).pop() || {} as any).type))
    return !hasGreedySections
  }
%}

@lexer lexer

Script -> _ ((TopLevelStatementsLine eol):* TopLevelStatementsLine eol?):?
  {% ([, statements]: any, _: any, reject: typeof Parser.fail) => {
    const ast: RmsAst = {
      type: 'RandomMapScript',
      statements: statements ? flatten<RmsTopLevelStatement>(combineLast(statements[0], statements[1])) : []
    }
    return validateAst(ast) ? ast : reject
  } %}

GenericIf[Child] -> %If ws identifier __
                    ($Child eol):*
                    (%Elseif ws identifier __ ($Child eol):*):*
                    (%Else __ ($Child eol):+):?
                    %Endif
  {% ([, , condition, , statements, elseifs, elseStatements]): RmsIf<any> => {
    const node: RmsIf<any> = { type: 'If', condition }
    if (statements.length) node.statements = flatten<any>(statements.map((s: any) => s[0][0]))
    if (elseifs.length) node.elseifs = elseifs.map(([, , condition, , statements]: any) => {
      const obj: { condition: string, statements?: any[] } = { condition }
      if (statements.length) obj.statements = flatten<any>(statements.map((s: any) => s[0][0]))
      return obj
    })
    if (elseStatements) node.elseStatements = flatten<any>(elseStatements[2].map((s: any) => s[0][0]))
    return node
  } %}

GenericAllowInlineComments[Statement] -> (MultilineComment ws?):* ($Statement (ws? MultilineComment):* | MultilineComment)
  {% ([beforeComments, commentOrParts]): any[] => {
    let statements: any[] = beforeComments.map((x: any) => x[0])
    // commentOrParts is either [statement, comments] or [comment].
    if (commentOrParts.length === 1) statements.push(commentOrParts[0])
    else statements = statements.concat([commentOrParts[0][0][0]], commentOrParts[1].map((x: any) => x[1]))
    return statements
  } %}

TopLevelStatementsLine -> GenericAllowInlineComments[(Section | ConstDefinition | FlagDefinition | TopLevelIf)]
  {% id %}

TopLevelIf -> GenericIf[TopLevelStatementsLine]
  {% id %}

Section -> %LArrow identifier %RArrow eol (SectionStatementsLine eol):* SectionStatementsLine
  {% ([, name, , , statements, last]): RmsSection => ({
    type: 'Section',
    name,
    statements: flatten<RmsSectionStatement>(combineLast(statements, last))
  }) %}

SectionStatementsLine -> GenericAllowInlineComments[(Command | ConstDefinition | FlagDefinition | SectionIf)]
  {% id %}

SectionIf -> GenericIf[SectionStatementsLine]
  {% id %}

Command -> Attribute (_ %LCurly eol? ((CommandStatementsLine eol):* CommandStatementsLine eol?):? %RCurly):?
  {% ([attr, statements]): RmsCommand => {
    const node: RmsCommand = { type: 'Command', name: attr.name, args: attr.args }
    if (statements && statements[3]) node.statements = flatten<RmsCommandStatement>(combineLast(statements[3][0], statements[3][1]))
    else if (statements) node.statements = []
    return node
  } %}

CommandStatementsLine -> GenericAllowInlineComments[(Attribute | CommandIf)]
  {% id %}

CommandIf -> GenericIf[CommandStatementsLine]
  {% id %}

Attribute -> identifier (ws (identifier | int)):*
  {% ([name, args]): RmsAttribute => ({
    type: 'Attribute',
    name: name,
    args: args.map((x: any) => x[1][0])
  }) %}

ConstDefinition -> %Const ws identifier ws int
  {% ([, , name, , value]): RmsConstDefinition => ({ type: 'ConstDefinition', name, value }) %}

FlagDefinition -> %Define ws identifier
  {% ([, , flag]): RmsFlagDefinition => ({ type: 'FlagDefinition', flag }) %}

MultilineComment -> %MultilineComment
 {% ([{ value }]): RmsMultilineComment => ({ type: 'MultilineComment', comment: value }) %}

# ==============================================================================
# Terminals
# ==============================================================================

int -> %Integer           {% ([token]) => parseInt(token.value, 10) %}
identifier -> %Identifier {% ([token]) => token.value %}

eol  -> %LineBreak              {% () => null %}
eol? -> eol:?                   {% () => null %}
ws   -> %Space                  {% () => null %}
ws?  -> ws:?                    {% () => null %}
__   -> (%LineBreak | %Space):+ {% () => null %}
_    -> __:?                    {% () => null %}
