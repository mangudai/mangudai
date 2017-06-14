import { Visitor } from './nearleyMiddleware'
import { RmsAst, RmsIf, RmsTopLevelStatement, RmsSection, RmsSectionStatement, RmsCommand, RmsCommandStatement,
  RmsAttribute, RmsConstDefinition, RmsFlagDefinition, RmsIncludeDrs, RmsMultilineComment } from './astTypes'

export const cstToAstVisitor: Visitor<any> = {
  Script: ([, statements]: any[]): RmsAst => ({
    type: 'RandomMapScript',
    statements: statements ? flatten<RmsTopLevelStatement>(combineLast(statements[0], statements[1])) : []
  }),

  TopLevelStatementsLine: ([parts]) => visitGenericAllowInlineComments(parts),
  TopLevelIf: ([parts]) => visitGenericIf(parts),

  Section: ([, name, , , statements, last]): RmsSection => ({
    type: 'Section',
    name,
    statements: flatten<RmsSectionStatement>(combineLast(statements, last))
  }),
  SectionStatementsLine: ([parts]) => visitGenericAllowInlineComments(parts),
  SectionIf: ([parts]) => visitGenericIf(parts),

  Command: ([attr, statements]): RmsCommand => {
    const node: RmsCommand = { type: 'Command', name: attr.name, args: attr.args }
    if (statements && statements[3]) node.statements = flatten<RmsCommandStatement>(combineLast(statements[3][0], statements[3][1]))
    else if (statements) node.statements = []
    return node
  },
  CommandStatementsLine: ([parts]) => visitGenericAllowInlineComments(parts),
  CommandIf: ([parts]) => visitGenericIf(parts),

  Attribute: ([name, args]): RmsAttribute => ({
    type: 'Attribute',
    name: name,
    args: args.map((x: any) => x[1][0])
  }),

  ConstDefinition: ([, , name, , value]): RmsConstDefinition => ({ type: 'ConstDefinition', name, value }),
  FlagDefinition: ([, , flag]): RmsFlagDefinition => ({ type: 'FlagDefinition', flag }),
  IncludeDrs: ([, , filename, id]): RmsIncludeDrs => {
    const node: RmsIncludeDrs = { type: 'IncludeDrs', filename }
    if (id) node.id = id[1]
    return node
  },

  MultilineComment: ([{ value }]): RmsMultilineComment => ({ type: 'MultilineComment', comment: value }),

  int: ([token]) => parseInt(token.value, 10),
  identifier: ([token]) => token.value,

  'eol': () => null,
  'eol?': () => null,
  'ws': () => null,
  'ws?': () => null,
  '__': () => null,
  '_': () => null
}

/**
 * Extract flat array of rule results from this: `(rule __):* rule`
 */
function combineLast (many: any[], last: any) { return many.map(x => x[0]).concat([last]) }

/**
 * Flatten an array or arrays.
 */
function flatten<T> (arrays: T[][]): T[] { return ([] as T[]).concat(...arrays) }

/**
 * In the grammar, `if` statements are written as a macro which is expanded in each place where it's used
 * during `.ne` compilation and isn't a real rule. Therefore, we can't visit `GenericIf` directly.
 */
function visitGenericIf ([, , condition, , statements, elseifs, elseStatements]: any): RmsIf<any> {
  const node: RmsIf<any> = { type: 'If', condition }
  if (statements.length) node.statements = flatten<any>(statements.map((s: any) => s[0][0]))
  if (elseifs.length) {
    node.elseifs = elseifs.map(([, , condition, , statements]: any) => {
      const obj: { condition: string, statements?: any[] } = { condition }
      if (statements.length) obj.statements = flatten<any>(statements.map((s: any) => s[0][0]))
      return obj
    })
  }
  if (elseStatements) node.elseStatements = flatten<any>(elseStatements[2].map((s: any) => s[0][0]))
  return node
}

/**
 * `GenericAllowInlineComments` is a macro, not a real rule. See `visitGenericIf` above for details.
 */
function visitGenericAllowInlineComments ([beforeComments, commentOrParts]: any): any[] {
  let statements: any[] = beforeComments.map((x: any) => x[0])
  // commentOrParts is either [statement, comments] or [comment].
  if (commentOrParts.length === 1) statements.push(commentOrParts[0])
  else statements = statements.concat([commentOrParts[0][0][0]], commentOrParts[1].map((x: any) => x[1]))
  return statements
}
