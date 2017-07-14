import { Token } from 'moo'
import { CstNode } from './cst'
import { hideCstProperties, getChildNode, getToken, getChildNodes } from '../treeHelpers'
import { AstNode, Script, IfStatement, ElseIfStatement, RandomStatement, ChanceStatement, SectionStatement,
  AttributeStatement, DeclarationStatement, IncludeDrsStatement, MultilineComment,
  CommandStatement, ConditionalCommandStatement } from './astTypes'

export function toAst (root: CstNode) {
  return nodeToAst(root) as Script
}

const astVisitorMap: { [x: string]: (node: CstNode) => AstNode } = {
  Script: (cstNode): Script => hideCstProperties(Object.assign(cstNode, {
    type: 'Script',
    statements: getChildNodes(getChildNode(cstNode, 'StatementsBlock', true)).map(nodeToAst)
  } as Script)),

  If: (ifNode): IfStatement => {
    const node = hideCstProperties(Object.assign(ifNode, {
      type: 'IfStatement',
      condition: getCondition(ifNode)
    } as IfStatement))

    addStatements(node, 'statements', ifNode)

    if ('ElseIf' in ifNode.childrenByType) {
      node.elseifs = getChildNodes(ifNode, 'ElseIf').map(elseIf => {
        const node = hideCstProperties(Object.assign(elseIf, {
          type: 'ElseIfStatement',
          condition: getCondition(elseIf)
        } as ElseIfStatement))
        addStatements(node, 'statements', elseIf)
        return node
      })
    }

    const elseNode = getChildNode(ifNode, 'Else')
    if (elseNode) addStatements(node, 'elseStatements', elseNode, true)

    return node

    function getCondition (node: CstNode) {
      return getToken(getChildNode(node, 'ConditionExpression', true), undefined, true).value
    }
  },

  Random: (node): RandomStatement => {
    hideCstProperties(Object.assign(node, {
      type: 'RandomStatement'
    } as RandomStatement))
    addStatements(node, 'statements', node, true)
    return node as RandomStatement
  },

  Chance: (node): ChanceStatement => {
    hideCstProperties(Object.assign(node, {
      type: 'ChanceStatement',
      chance: getTokenValue(getToken(node, 'int', true)) as number
    } as ChanceStatement))
    addStatements(node, 'statements', node, true)
    return node as ChanceStatement
  },

  Section: (cstNode): SectionStatement => hideCstProperties(Object.assign(cstNode, {
    type: 'SectionStatement',
    name: getToken(cstNode, 'identifier', true).value,
    statements: getChildNodes(getChildNode(cstNode, 'StatementsBlock', true)).map(nodeToAst)
  } as SectionStatement)),

  Command: (cstNode): CommandStatement => {
    const astNode = hideCstProperties(Object.assign(cstNode, {
      type: 'CommandStatement',
      ...getNameAndArgs(getChildNode(cstNode, 'CommandHeader', true))
    } as CommandStatement))
    const body = getChildNode(cstNode, 'CommandBody')
    if (body) visitCommandBody(astNode, body)
    return astNode
  },

  ConditionalCommand: (cstNode): ConditionalCommandStatement => {
    const astNode = hideCstProperties(Object.assign(cstNode, {
      type: 'ConditionalCommandStatement',
      header: nodeToAst(getChildNode(cstNode, 'If', true))
    } as ConditionalCommandStatement))
    visitCommandBody(astNode, getChildNode(cstNode, 'CommandBody', true))
    return astNode
  },

  Attribute: (cstNode): AttributeStatement => hideCstProperties(Object.assign(cstNode, {
    type: 'AttributeStatement',
    ...getNameAndArgs(cstNode)
  } as AttributeStatement)),

  ConstDefinition: (cstNode): DeclarationStatement => {
    const { name, args } = getNameAndArgs(cstNode)
    return hideCstProperties(Object.assign(cstNode, {
      type: 'DeclarationStatement',
      kind: 'const',
      name,
      value: args[0] as number
    } as DeclarationStatement))
  },

  FlagDefinition: (cstNode): DeclarationStatement => hideCstProperties(Object.assign(cstNode, {
    type: 'DeclarationStatement',
    kind: 'define',
    name: getNameAndArgs(cstNode).name
  } as DeclarationStatement)),

  IncludeDrs: (cstNode): IncludeDrsStatement => {
    const { name, args } = getNameAndArgs(cstNode)
    const astNode: IncludeDrsStatement = hideCstProperties(Object.assign(cstNode, {
      type: 'IncludeDrsStatement',
      filename: name
    } as IncludeDrsStatement))
    if (args.length) astNode.id = args[0] as number
    return astNode
  },

  MultilineComment: (cstNode): MultilineComment => hideCstProperties(Object.assign(cstNode, {
    type: 'MultilineComment',
    comment: getToken(cstNode, 'multilineComment', true).value
  } as MultilineComment))
}

function visitCommandBody (command: CommandStatement | ConditionalCommandStatement, body: CstNode) {
  addStatements(command, 'statements', body, true)

  const preCommentsContainer = getChildNode(body, 'PreCurlyComments')
  if (preCommentsContainer) {
    const preComments = getChildNodes(preCommentsContainer, 'MultilineComment').map(nodeToAst)
    if (preComments.length) command.preLeftCurlyComments = preComments as MultilineComment[]
  }
}

function nodeToAst (node: CstNode) {
  return astVisitorMap[node.type](node)
}

function addStatements (targetAstNode: any, propName: string, sourceCstNode: CstNode, addEmptyArrayIfNone = false) {
  const statements = getChildNodes(getChildNode(sourceCstNode, 'StatementsBlock', true)).map(nodeToAst)
  if (statements.length || addEmptyArrayIfNone) targetAstNode[propName] = statements
}

function getNameAndArgs (node: CstNode) {
  const [name, ...args] = node.children.filter(isValueToken).map(getTokenValue)
  return { name: name as string, args }
}

function getTokenValue (token: Token) {
  if (token.type === 'int') return parseInt(token.value, 10)
  else return token.value
}

function isValueToken (token: Token) {
  return ['int', 'identifier'].includes(token.type as string)
}
