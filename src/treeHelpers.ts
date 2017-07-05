import { Token } from 'moo'
import { AstNode, RmsIf } from './parseRms/astTypes'
import { CstNode, CstNodeChild } from './parseRms/cst'

const cstDescendantsCache = new WeakMap<CstNode, CstNodeChild[]>()
const astDescendantsCache = new WeakMap<AstNode, AstNode[]>()

export function getAstChildren (node: AstNode, type?: string): AstNode[] {
  const children: AstNode[] = []
  switch (node.type) {
    case 'IfStatement':
      children.push(...((node as RmsIf<any>).elseifs || []))
      children.push(...((node as RmsIf<any>).elseStatements || []))
      /* falls through */
    case 'RandomMapScript':
    case 'ElseIfStatement':
    case 'Section':
    case 'Command':
      children.push(...((node as any).statements || []))
  }
  return type ? children.filter(x => x.type === type) : children
}

export function getAstDescendants (node: AstNode, type?: string): AstNode[] {
  let all: AstNode[] = []

  if (astDescendantsCache.has(node)) {
    all = astDescendantsCache.get(node) || []
  } else {
    getAstChildren(node).forEach(x => {
      all.push(x, ...getAstDescendants(x))
    })
    astDescendantsCache.set(node, all)
  }

  return type ? all.filter(x => x.type === type) : all
}

export function getChildren (node: CstNode, type?: string): CstNodeChild[] {
  if (!type) {
    return node.children
  } else if (type in node.childrenByType) {
    return node.childrenByType[type]
  } else {
    return []
  }
}

export function getFirstChild (node: CstNode, type?: string): CstNodeChild | undefined {
  if (!type) {
    return node.children.length ? node.children[0] : undefined
  } else if (type in node.childrenByType && node.childrenByType[type].length) {
    return node.childrenByType[type][0]
  }
}

export function getLastChild (node: CstNode, type?: string): CstNodeChild | undefined {
  if (!type) {
    return node.children.length ? node.children[node.children.length - 1] : undefined
  } else if (type in node.childrenByType && node.childrenByType[type].length) {
    return node.childrenByType[type][node.childrenByType[type].length - 1]
  }
}

export function getDescendants (node: CstNode, type?: string): CstNodeChild[] {
  let all: CstNodeChild[] = []

  if (cstDescendantsCache.has(node)) {
    all = cstDescendantsCache.get(node) || []
  } else {
    node.children.forEach(x => {
      all.push(x)
      if (!isToken(x)) all.push(...getDescendants(x))
    })
    cstDescendantsCache.set(node, all)
  }

  return type ? all.filter(x => x.type === type) : all
}

export function getFirstDescendant (node: CstNode, type?: string): CstNodeChild | undefined {
  const all = getDescendants(node, type)
  return all.length ? all[0] : undefined
}

export function getLastDescendant (node: CstNode, type?: string): CstNodeChild | undefined {
  const all = getDescendants(node, type)
  return all.length ? all[all.length - 1] : undefined
}

export function getTokens (node: CstNode, type?: string): Token[] {
  return getDescendants(node, type).filter(isToken)
}

export function getFirstToken (node: CstNode, type?: string): Token | undefined {
  const all = getTokens(node, type)
  return all.length ? all[0] : undefined
}

export function getLastToken (node: CstNode, type?: string): Token | undefined {
  const all = getTokens(node, type)
  return all.length ? all[all.length - 1] : undefined
}

export function getNodes (node: CstNode, type?: string): CstNode[] {
  return getDescendants(node, type).filter(x => !isToken(x)) as CstNode[]
}

export function getFirstNode (node: CstNode, type?: string): CstNode | undefined {
  const all = getNodes(node, type)
  return all.length ? all[0] : undefined
}

export function getLastNode (node: CstNode, type?: string): CstNode | undefined {
  const all = getNodes(node, type)
  return all.length ? all[all.length - 1] : undefined
}

export function addHiddenCst (astNode: any, cstNode: CstNode): any {
  Object.defineProperty(astNode, 'children', { enumerable: false, value: cstNode.children })
  Object.defineProperty(astNode, 'childrenByType', { enumerable: false, value: cstNode.childrenByType })
  return astNode
}

export function isToken (node: any): node is Token {
  return !('children' in node)
}
