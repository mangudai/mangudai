import { Token } from 'moo'
import { CstNode, CstNodeChild } from './cst'
import { hideCstProperties, getFirstChildNode, getFirstToken } from '../treeHelpers'
import { AstNode, RmsAst, RmsIf, ElseIf, RandomStatement, ChanceStatement, RmsTopLevelStatement, RmsSection, RmsSectionStatement, RmsCommand,
  RmsAttribute, RmsConstDefinition, RmsFlagDefinition, RmsIncludeDrs, RmsMultilineComment } from './astTypes'

export function toAst (root: CstNode) {
  return nodeToAst(root) as RmsAst
}

const astVisitorMap: { [x: string]: (node: CstNode) => AstNode } = {
  RandomMapScript: (cstNode): RmsAst => hideCstProperties(Object.assign(cstNode, {
    type: 'RandomMapScript',
    statements: (getFirstChildNode(cstNode, 'StatementsBlock') as CstNode).children.filter(noTokens).map(nodeToAst) as RmsTopLevelStatement[]
  } as RmsAst)),

  If: (ifNode): RmsIf<AstNode> => {
    const node: RmsIf<AstNode> = hideCstProperties(Object.assign(ifNode, {
      type: 'IfStatement',
      condition: getCondition(ifNode)
    } as RmsIf<AstNode>))
    addStatements(node, 'statements', ifNode)

    if ('ElseIf' in ifNode.childrenByType) {
      node.elseifs = (ifNode.childrenByType.ElseIf as CstNode[]).map(elseIf => {
        const node: ElseIf<AstNode> = hideCstProperties(Object.assign(elseIf, {
          type: 'ElseIfStatement',
          condition: getCondition(elseIf)
        } as ElseIf<AstNode>))
        addStatements(node, 'statements', elseIf)
        return node
      })
    }

    if ('Else' in ifNode.childrenByType) {
      const elseNode = ifNode.childrenByType.Else[0] as CstNode
      addStatements(node, 'elseStatements', elseNode)
    }

    return node

    function getCondition (node: CstNode) {
      return ((node.childrenByType.ConditionExpression[0] as CstNode).children[0] as Token).value
    }
  },

  RandomStatement: node => {
    hideCstProperties(node)
    addStatements(node, 'statements', node, true)
    return node as RandomStatement<AstNode>
  },

  ChanceStatement: node => {
    hideCstProperties(node)
    ;(node as ChanceStatement<AstNode>).chance = getTokenValue(getFirstToken(node, 'Integer') as Token) as number
    addStatements(node, 'statements', node, true)
    return node as ChanceStatement<AstNode>
  },

  Section: (cstNode): RmsSection => hideCstProperties(Object.assign(cstNode, {
    type: 'Section',
    name: ((cstNode.childrenByType.SectionHeader[0] as CstNode).childrenByType.Identifier[0] as Token).value,
    statements: (cstNode.childrenByType.StatementsBlock[0] as CstNode).children.filter(noTokens).map(nodeToAst) as RmsSectionStatement[]
  } as RmsSection)),

  Command: (cstNode): RmsCommand => {
    const astNode: RmsCommand = hideCstProperties(Object.assign(cstNode, {
      type: 'Command',
      ...getNameAndArgs(cstNode.childrenByType.CommandHeader[0] as CstNode)
    } as RmsCommand))
    if ('CommandStatementsBlock' in cstNode.childrenByType) {
      astNode.statements = []
      addStatements(astNode, 'statements', cstNode.childrenByType.CommandStatementsBlock[0] as CstNode)
    }
    return astNode
  },

  Attribute: (cstNode): RmsAttribute => hideCstProperties(Object.assign(cstNode, {
    type: 'Attribute',
    ...getNameAndArgs(cstNode)
  } as RmsAttribute)),

  ConstDefinition: (cstNode): RmsConstDefinition => {
    const { name, args } = getNameAndArgs(cstNode)
    return hideCstProperties(Object.assign(cstNode, {
      type: 'ConstDefinition',
      name,
      value: args[0] as number
    } as RmsConstDefinition))
  },

  FlagDefinition: (cstNode): RmsFlagDefinition => hideCstProperties(Object.assign(cstNode, {
    type: 'FlagDefinition',
    flag: getNameAndArgs(cstNode).name
  } as RmsFlagDefinition)),

  IncludeDrs: (cstNode): RmsIncludeDrs => {
    const { name, args } = getNameAndArgs(cstNode)
    const astNode: RmsIncludeDrs = hideCstProperties(Object.assign(cstNode, {
      type: 'IncludeDrs',
      filename: name
    } as RmsIncludeDrs))
    if (args.length) astNode.id = args[0] as number
    return astNode
  },

  MultilineComment: (cstNode): RmsMultilineComment => hideCstProperties(Object.assign(cstNode, {
    type: 'MultilineComment',
    comment: (cstNode.childrenByType.MultilineComment[0] as Token).value
  } as RmsMultilineComment))
}

function nodeToAst (node: CstNode) {
  return astVisitorMap[node.type](node)
}

function addStatements (targetAstNode: any, propName: string, sourceCstNode: CstNode, addEmptyArrayIfNone = false) {
  const statements = (sourceCstNode.childrenByType.StatementsBlock[0] as CstNode).children.filter(noTokens)
  if (statements.length || addEmptyArrayIfNone) targetAstNode[propName] = statements.map(nodeToAst)
}

function getNameAndArgs (node: CstNode) {
  const [name, ...args] = node.children.filter(isValueToken).map(getTokenValue)
  return { name: name as string, args }
}

function getTokenValue (token: Token) {
  if (token.type === 'Integer') return parseInt(token.value, 10)
  else return token.value
}

function isValueToken (token: Token) {
  return ['Integer', 'Identifier'].includes(token.type as string)
}

function noTokens (node: CstNodeChild): node is CstNode {
  return 'children' in node
}
