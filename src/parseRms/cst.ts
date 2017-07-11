import { flattenDeep, groupBy, RecursiveArray } from 'lodash'
import { Token } from 'moo'
import { RuleNodeChildren, RuleNode } from './nearleyMiddleware'
import { isToken, getChildNodes, getFirstNode, getNodes } from '../treeHelpers'

export function toCst (root: RuleNode) {
  return nodeToCst(root) as CstNode
}

const cstVisitorMap: { [x: string]: (parts: RuleNodeChildren) => CstNode | CstNodeChild[] } = {
  Script: parts => simpleCstNode([simpleCstNode(parts, 'StatementsBlock')], 'RandomMapScript'),
  TopLevelLine: parts => partsToCstNodes(parts),
  TopLevelIf: parts => visitGenericIf(parts),
  TopLevelRandom: parts => visitGenericRandom(parts),

  Section: ([larrow, name, rarrow, statements]) => {
    // Section rule in the grammar is extremely greedy to avoid ambiguity.
    // We're gonna transform it to CST and then see if there's stuff at the end that should be outside.
    const sectionHeader = simpleCstNode([larrow, name, rarrow], 'SectionHeader')
    const statementsBlock = simpleCstNode([statements], 'StatementsBlock')

    // We're gonna check a couple things and see if we need to split the statements
    // moving the last ones to top level.
    let splitIndex = statementsBlock.children.length

    // To keep grammar fast and unambiguous, we allow TopLevelIf to occur inside Section.
    // Let's check if there're any If nodes that contain Section nodes. If there are,
    // then this section should definitely end before the first one.
    const firstTopLevelIf = getChildNodes(statementsBlock, 'If').find(x => getFirstNode(x, 'Section') !== undefined)
    if (firstTopLevelIf) splitIndex = statementsBlock.children.indexOf(firstTopLevelIf)

    // Statements at the end that can be outside should go outside.
    for (let i = splitIndex - 1; i >= 0; i--) {
      const node = statementsBlock.children[i]
      if (isToken(node) && node.type !== 'LineBreak') continue
      if (!isToken(node) && node.type === 'Command') break
      if (!isToken(node) && getNodes(node, 'Command').length) break
      splitIndex = i
    }

    if (splitIndex < statementsBlock.children.length) {
      const statementsOutside = statementsBlock.children.slice(splitIndex)
      const statementsInside = simpleCstNode([statementsBlock.children.slice(0, splitIndex)], 'StatementsBlock')
      return [simpleCstNode([sectionHeader, statementsInside], 'Section'), ...statementsOutside]
    } else {
      return simpleCstNode([sectionHeader, statementsBlock], 'Section')
    }
  },
  SectionLine: parts => partsToCstNodes(parts),
  SectionIf: parts => visitGenericIf(parts),
  SectionRandom: parts => visitGenericRandom(parts),

  Command: ([header, attributes]: [RuleNode, RuleNodeChildren]) => simpleCstNode([
    simpleCstNode(unwrapTokens([header]), 'CommandHeader'),
    attributes ? simpleCstNode([
      attributes[0], attributes[1], attributes[2],
      simpleCstNode([attributes[3]], 'StatementsBlock'),
      attributes[4]
    ], 'CommandStatementsBlock') : null
  ], 'Command'),
  CommandLevelLine: parts => partsToCstNodes(parts),
  CommandIf: parts => visitGenericIf(parts),
  CommandRandom: parts => visitGenericRandom(parts),

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
    elseifs.map(([elseifToken, ws1, condition, ws2, ...statements]: any) => simpleCstNode([
      elseifToken, ws1, simpleCstNode([condition], 'ConditionExpression'), ws2,
      simpleCstNode(statements, 'StatementsBlock')
    ], 'ElseIf')),
    elseStuff ? simpleCstNode([
      elseStuff[0], elseStuff[1], simpleCstNode(elseStuff.slice(2), 'StatementsBlock')
    ], 'Else') : null,
    endifToken
  ], 'If')
}

function visitGenericRandom ([[startToken, ws, comments, chances, endToken]]: any) {
  return simpleCstNode([
    startToken, ws,
    simpleCstNode([
      comments,
      chances.map(([chanceToken, ws1, percent, ws2, statements]: any) => simpleCstNode([
        chanceToken, ws1, percent, ws2, simpleCstNode(statements, 'StatementsBlock')
      ], 'ChanceStatement'))
    ], 'StatementsBlock'),
    endToken
  ], 'RandomStatement')
}

function unwrapTokens (parts: RuleNodeChildren): Token[] {
  const onlyTokens = flattenParts(parts).map(part => isToken(part) ? part : unwrapTokens(part.children))
  return flattenDeep(onlyTokens) as Token[]
}

function flattenParts (parts: RuleNodeChildren) {
  return flattenDeep(parts).filter(p => p !== null) as (RuleNode | Token)[]
}
