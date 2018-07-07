import { LintError } from '../'
import { Token, Script, AstNode, DeclarationStatement, IfStatement, RandomStatement,
  ChanceStatement, Statement } from '../../parse'
import { getToken } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'

type SeenIdentifiers = { [x: string]: boolean }

export function check (ast: Script): LintError[] {
  const redeclared: Token[] = []

  function reduceStatementsToSeen (statements: Statement[] | undefined, seen: SeenIdentifiers): SeenIdentifiers {
    return (statements && statements.length)
      ? statements.reduce((acc, statement) => ({ ...acc, ...visitNode(statement, acc) }), seen)
      : seen
  }

  function visitIfNode (node: IfStatement, seen: SeenIdentifiers) {
    const seenInIfBranch = reduceStatementsToSeen(node.statements, seen)
    const seenInElseIfBranches = !node.elseifs
      ? seen
      : node.elseifs
        .map(elseIf => reduceStatementsToSeen(elseIf.statements, seen))
        .reduce((acc, next) => ({ ...acc, ...next }), seen)
    const seenInElseBranch = reduceStatementsToSeen(node.elseStatements, seen)

    return {
      ...seenInIfBranch,
      ...seenInElseIfBranches,
      ...seenInElseBranch
    }
  }

  function visitRandomNode (node: RandomStatement, seen: SeenIdentifiers) {
    return node.statements
      .filter(s => s.type === 'ChanceStatement')
      .map(chance => reduceStatementsToSeen((chance as ChanceStatement).statements, seen))
      .reduce((acc, next) => ({ ...acc, ...next }), seen)
  }

  function visitDeclarationNode (node: DeclarationStatement, seen: SeenIdentifiers) {
    const nameToken = getToken(node, 'identifier', true)

    if (seen[nameToken.value]) {
      redeclared.push(nameToken)
      return seen
    } else {
      return { ...seen, [nameToken.value]: true }
    }
  }

  function visitNode (node: AstNode, seen: SeenIdentifiers) {
    if (node.type === 'IfStatement') {
      return visitIfNode(node as IfStatement, seen)
    } else if (node.type === 'RandomStatement') {
      return visitRandomNode(node as RandomStatement, seen)
    } else if (node.type === 'DeclarationStatement') {
      return visitDeclarationNode(node as DeclarationStatement, seen)
    } else if ('statements' in (node as Statement)) {
      return reduceStatementsToSeen((node as any).statements, seen)
    } else {
      return seen
    }
  }

  visitNode(ast, {})

  return redeclared.map(x => ({
    name: 'LintError',
    message: `${x.value} is already defined!`,
    boundaries: getBoundaries(x)
  } as LintError))
}
