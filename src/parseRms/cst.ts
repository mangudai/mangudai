import { flattenDeep, groupBy, RecursiveArray } from 'lodash'
import { Token } from 'moo'
import { RuleNodeChildren, RuleNode } from './nearleyMiddleware'
import { getChildren, getDescendants, isToken } from '../treeHelpers'

export function toCst (root: RuleNode) {
  return nodeToCst(root) as CstNode
}

// Reject parsings with const/define/comment as the last section statement
// as it's usually intended to be a top-level statement instead and
// we have to decide one way or another.
export function isNotAmbiguousCst (cst: CstNode): boolean {
  return !getChildren(cst, 'Section').some(isAmbiguousSection)

  function isAmbiguousSection (section: CstNode): boolean {
    const statements = (getChildren(section, 'StatementsBlock')[0] as CstNode).children.filter(x => !isToken(x))
    if (!statements.length) return false

    const last = statements.pop() as CstNode
    return last.type !== 'Command' && !getDescendants(last, 'Command').length
  }
}

const cstVisitorMap: { [x: string]: (parts: RuleNodeChildren) => CstNode | CstNodeChild[] } = {
  Script: parts => simpleCstNode(parts, 'RandomMapScript'),
  TopLevelStatementsLine: parts => partsToCstNodes(parts),
  TopLevelIf: parts => visitGenericIf(parts),

  Section: ([larrow, name, rarrow, statements]) => simpleCstNode([
    simpleCstNode([larrow, name, rarrow], 'SectionHeader'),
    simpleCstNode([statements], 'StatementsBlock')
  ], 'Section'),
  SectionStatementsLine: parts => partsToCstNodes(parts),
  SectionIf: parts => visitGenericIf(parts),

  Command: ([header, attributes]: [RuleNode, RuleNodeChildren]) => simpleCstNode([
    simpleCstNode(unwrapTokens([header]), 'CommandHeader'),
    attributes ? simpleCstNode([
      attributes[0], attributes[1], attributes[2],
      simpleCstNode([attributes[3]], 'StatementsBlock'),
      attributes[4]
    ], 'CommandStatementsBlock') : null
  ], 'Command'),
  CommandStatementsLine: parts => partsToCstNodes(parts),
  CommandIf: parts => visitGenericIf(parts),

  Attribute: parts => simpleCstNode(parts, 'Attribute'),

  ConstDefinition: parts => simpleCstNode(parts, 'ConstDefinition'),
  FlagDefinition: parts => simpleCstNode(parts, 'FlagDefinition'),
  IncludeDrs: parts => simpleCstNode(parts, 'IncludeDrs'),

  MultilineComment: parts => simpleCstNode(parts, 'MultilineComment'),

  int: parts => unwrapTokens(parts),
  identifier: parts => unwrapTokens(parts),

  'eol': parts => unwrapTokens(parts),
  'eol?': parts => unwrapTokens(parts),
  'ws': parts => unwrapTokens(parts),
  'ws?': parts => unwrapTokens(parts),
  '__': parts => unwrapTokens(parts),
  '_': parts => unwrapTokens(parts)
}

function nodeToCst ({ type, children }: RuleNode) {
  return cstVisitorMap[type](children)
}

export type CstNodeChild = CstNode | Token
export type CstNode = {
  type: string,
  children: CstNodeChild[],
  childrenByType: { [x: string]: Token[] | CstNode[] }
}

function partsToCstNodes (parts: RecursiveArray<CstNode | RuleNode | Token | null>) {
  const flatParts = flattenParts(parts)
  const convertedParts = flatParts.map(part => {
    if ('children' in part && !('childrenByType' in part)) return nodeToCst(part as RuleNode)
    else return part
  })
  return flattenDeep(convertedParts) as (CstNode | Token)[]
}

function simpleCstNode (parts: any[], type: string): CstNode {
  const children = partsToCstNodes(parts)
  return { type, children, childrenByType: groupBy(children, 'type') as { [x: string]: Token[] | CstNode[] } }
}

function visitGenericIf ([[ifToken, ws1, condition, ws2, statements, elseifs, elseStuff, endifToken]]: any) {
  return simpleCstNode([
    ifToken, ws1, simpleCstNode([condition], 'ConditionExpression'), ws2,
    simpleCstNode(statements, 'StatementsBlock'),
    elseifs.map(([elseifToken, ws1, condition, ws2, statements]: any) => simpleCstNode([
      elseifToken, ws1, simpleCstNode([condition], 'ConditionExpression'), ws2,
      simpleCstNode(statements, 'StatementsBlock')
    ], 'ElseIf')),
    elseStuff ? simpleCstNode([
      elseStuff[0], elseStuff[1], simpleCstNode(elseStuff[2], 'StatementsBlock')
    ], 'Else') : null,
    endifToken
  ], 'If')
}

function unwrapTokens (parts: RuleNodeChildren): Token[] {
  const onlyTokens = flattenParts(parts).map(part => isToken(part) ? part : unwrapTokens(part.children))
  return flattenDeep(onlyTokens) as Token[]
}

function flattenParts (parts: RuleNodeChildren) {
  return flattenDeep(parts).filter(p => p !== null) as (RuleNode | Token)[]
}
