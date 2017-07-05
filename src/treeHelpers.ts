import { CstNode, CstNodeChild } from './cst'
import { Token } from 'moo'

const descendantsCache = new WeakMap<CstNode, CstNodeChild[]>()

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

  if (descendantsCache.has(node)) {
    all = descendantsCache.get(node) as CstNodeChild[]
  } else {
    node.children.forEach(x => {
      all.push(x)
      if ('children' in x) all = [...all, ...getDescendants(x as CstNode, type)]
    })
    descendantsCache.set(node, all)
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

export function addHiddenCst (astNode: any, cstNode: CstNode): any {
  Object.defineProperty(astNode, 'children', { enumerable: false, value: cstNode.children })
  Object.defineProperty(astNode, 'childrenByType', { enumerable: false, value: cstNode.childrenByType })
  return astNode
}

export function isToken (node: any): node is Token {
  return !('children' in node)
}
