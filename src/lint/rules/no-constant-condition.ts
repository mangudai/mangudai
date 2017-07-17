import { Token } from 'moo'
import { LintError } from '../'
import { Script, IfStatement, ElseIfStatement, DeclarationStatement } from '../../parse'
import { getDescendants, getToken, getNodes } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'
import { CstNode } from '../../parse/cst'

export function check (ast: Script): LintError[] {
  const conditionallyDefined: string[] = []
  const unconditionallyDefined: string[] = []
  const invalidConditionIdentifiers: Token[] = []

  const condBlocks = [...getNodes(ast, 'IfStatement'), ...getNodes(ast, 'ChanceStatement')]
  condBlocks.forEach(parent => {
    conditionallyDefined.push(...getDefines(parent).map(x => x.name))
  })

  getDefines(ast).forEach(({ name }) => {
    if (!conditionallyDefined.includes(name)) unconditionallyDefined.push(name)
  })

  const allIfs = [...getDescendants(ast, 'IfStatement'), ...getDescendants(ast, 'ElseIfStatement')]
  allIfs.forEach((ifNode: IfStatement | ElseIfStatement) => {
    if (unconditionallyDefined.includes(ifNode.condition)) {
      invalidConditionIdentifiers.push(getToken(ifNode, 'identifier') as Token)
    }
  })

  return invalidConditionIdentifiers.map<LintError>(x => ({
    name: 'LintError',
    message: `Condition '${x.value}' is always true.`,
    boundaries: getBoundaries(x)
  }))
}

function getDefines (parent: CstNode): DeclarationStatement[] {
  return (getNodes(parent, 'DeclarationStatement') as DeclarationStatement[]).filter(x => x.kind === 'define')
}
