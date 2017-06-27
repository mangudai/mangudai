import { Token } from 'moo'
import { CstNode, CstNodeChild } from './cst'
import { AstNode, RmsAst, RmsIf, ElseIf, RmsTopLevelStatement, RmsSection, RmsSectionStatement, RmsCommand, RmsCommandStatement,
  RmsAttribute, RmsConstDefinition, RmsFlagDefinition, RmsIncludeDrs, RmsMultilineComment } from './astTypes'

export function toAst (root: CstNode) {
  return nodeToAst(root) as RmsAst
}

const astVisitorMap: { [x: string]: (node: CstNode) => AstNode } = {
  RandomMapScript: ({ children }): RmsAst => ({
    type: 'RandomMapScript',
    statements: children.filter(noTokens).map(nodeToAst) as RmsTopLevelStatement[]
  }),

  If: (ifNode): RmsIf<any> => {
    const node: RmsIf<AstNode> = {
      type: 'If',
      condition: getCondition(ifNode)
    }
    addStatementsIfAny(node, 'statements', ifNode)

    if ('ElseIf' in ifNode.childrenByType) {
      node.elseifs = (ifNode.childrenByType.ElseIf as CstNode[]).map(elseIf => {
        const node: ElseIf<AstNode> = { condition: getCondition(elseIf) }
        addStatementsIfAny(node, 'statements', elseIf)
        return node
      })
    }

    if ('Else' in ifNode.childrenByType) {
      const elseNode = ifNode.childrenByType.Else[0] as CstNode
      addStatementsIfAny(node, 'elseStatements', elseNode)
    }

    return node

    function getCondition (node: CstNode) {
      return ((node.childrenByType.ConditionExpression[0] as CstNode).children[0] as Token).value
    }
  },

  Section: (node): RmsSection => {
    return {
      type: 'Section',
      name: ((node.childrenByType.SectionHeader[0] as CstNode).childrenByType.Identifier[0] as Token).value,
      statements: (node.childrenByType.StatementsBlock[0] as CstNode).children.filter(noTokens).map(nodeToAst) as RmsSectionStatement[]
    }
  },

  Command: (cstNode): RmsCommand => {
    const astNode: RmsCommand = {
      type: 'Command',
      ...getNameAndArgs(cstNode.childrenByType.CommandHeader[0] as CstNode)
    }
    if ('CommandStatementsBlock' in cstNode.childrenByType) {
      astNode.statements = [] as RmsCommandStatement[]
      addStatementsIfAny(astNode, 'statements', cstNode.childrenByType.CommandStatementsBlock[0] as CstNode)
    }
    return astNode
  },

  Attribute: (cstNode): RmsAttribute => ({
    type: 'Attribute',
    ...getNameAndArgs(cstNode)
  }),

  ConstDefinition: (node): RmsConstDefinition => {
    const { name, args } = getNameAndArgs(node)
    return { type: 'ConstDefinition', name, value: args[0] as number }
  },

  FlagDefinition: (node): RmsFlagDefinition => ({
    type: 'FlagDefinition',
    flag: getNameAndArgs(node).name
  }),

  IncludeDrs: (cstNode): RmsIncludeDrs => {
    const { name, args } = getNameAndArgs(cstNode)
    const astNode: RmsIncludeDrs = { type: 'IncludeDrs', filename: name }
    if (args.length) astNode.id = args[0] as number
    return astNode
  },

  MultilineComment: (node): RmsMultilineComment => ({
    type: 'MultilineComment',
    comment: (node.childrenByType.MultilineComment[0] as Token).value
  })
}

function nodeToAst (node: CstNode) {
  return astVisitorMap[node.type](node)
}

function addStatementsIfAny (targetAstNode: any, propName: string, sourceCstNode: CstNode) {
  const statements = (sourceCstNode.childrenByType.StatementsBlock[0] as CstNode).children.filter(noTokens)
  if (statements.length) targetAstNode[propName] = statements.map(nodeToAst)
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
