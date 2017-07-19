import { Token, CstNode, CstNodeChild } from './parse'

const descendantsCache = new WeakMap<CstNode, CstNodeChild[]>()

export function getChildren (node: CstNode, type?: string): CstNodeChild[] {
  return type ? (node.childrenByType[type] || []) : node.children
}

export function getChild (node: CstNode, type: string | undefined, orThrow: true): CstNodeChild
export function getChild (node: CstNode, type?: string, orThrow?: false): CstNodeChild | undefined
export function getChild (node: CstNode, type?: string, orThrow?: boolean) {
  const children = type ? (node.childrenByType[type] || []) : node.children

  if (children.length) return children[0]
  if (!orThrow) return undefined
  throw new Error(`Cannot find a child '${type || '<any>'}' of '${node.type}'!`)
}

export function getDescendants (node: CstNode, type?: string): CstNodeChild[] {
  let all: CstNodeChild[] = []

  if (descendantsCache.has(node)) {
    all = descendantsCache.get(node) || []
  } else {
    node.children.forEach(x => {
      all.push(x)
      if (isNode(x)) all.push(...getDescendants(x))
    })
    descendantsCache.set(node, all)
  }

  return type ? all.filter(x => x.type === type) : all
}

export function getDescendant (node: CstNode, type: string | undefined, orThrow: true): CstNodeChild
export function getDescendant (node: CstNode, type?: string, orThrow?: false): CstNodeChild | undefined
export function getDescendant (node: CstNode, type?: string, orThrow?: boolean) {
  const all = getDescendants(node, type)
  if (all.length) return all[0]
  if (!orThrow) return undefined
  throw new Error(`Cannot find a descendant '${type || '<any>'}' of '${node.type}'!`)
}

export function getTokens (node: CstNode, type?: string): Token[] {
  return getDescendants(node, type).filter(isToken)
}

export function getToken (node: CstNode, type: string | undefined, orThrow: true): Token
export function getToken (node: CstNode, type?: string, orThrow?: false): Token | undefined
export function getToken (node: CstNode, type?: string, orThrow?: boolean) {
  const all = getTokens(node, type)
  if (all.length) return all[0]
  if (!orThrow) return undefined
  throw new Error(`Cannot find a token '${type || '<any>'}' in '${node.type}'!`)
}

export function getLastToken (node: CstNode, type: string | undefined, orThrow: true): Token
export function getLastToken (node: CstNode, type?: string, orThrow?: false): Token | undefined
export function getLastToken (node: CstNode, type?: string, orThrow?: boolean) {
  const all = getTokens(node, type)
  if (all.length) return all[all.length - 1]
  if (!orThrow) return undefined
  throw new Error(`Cannot find a token '${type || '<any>'}' in '${node.type}'!`)
}

export function getChildNodes (node: CstNode, type?: string): CstNode[] {
  return getChildren(node, type).filter(isNode)
}

export function getChildNode (node: CstNode, type: string | undefined, orThrow: true): CstNode
export function getChildNode (node: CstNode, type?: string, orThrow?: false): CstNode | undefined
export function getChildNode (node: CstNode, type?: string, orThrow?: boolean) {
  const all = getChildNodes(node, type)
  if (all.length) return all[0]
  if (!orThrow) return undefined
  throw new Error(`Cannot find a node '${type || '<any>'}' of '${node.type}'!`)
}

export function getLastChildNode (node: CstNode, type: string | undefined, orThrow: true): CstNode
export function getLastChildNode (node: CstNode, type?: string, orThrow?: false): CstNode | undefined
export function getLastChildNode (node: CstNode, type?: string, orThrow?: boolean) {
  const all = getChildNodes(node, type)
  if (all.length) return all[all.length - 1]
  if (!orThrow) return undefined
  throw new Error(`Cannot find a node '${type || '<any>'}' of '${node.type}'!`)
}

export function getNodes (node: CstNode, type?: string): CstNode[] {
  return getDescendants(node, type).filter(isNode)
}

export function getNode (node: CstNode, type: string | undefined, orThrow: true): CstNode
export function getNode (node: CstNode, type?: string, orThrow?: false): CstNode | undefined
export function getNode (node: CstNode, type?: string, orThrow?: boolean) {
  const all = getNodes(node, type)
  if (all.length) return all[0]
  if (!orThrow) return undefined
  throw new Error(`Cannot find a node '${type || '<any>'}' of '${node.type}'!`)
}

export function getLastNode (node: CstNode, type: string | undefined, orThrow: true): CstNode
export function getLastNode (node: CstNode, type?: string, orThrow?: false): CstNode | undefined
export function getLastNode (node: CstNode, type?: string, orThrow?: boolean) {
  const all = getNodes(node, type)
  if (all.length) return all[all.length - 1]
  if (!orThrow) return undefined
  throw new Error(`Cannot find a node '${type || '<any>'}' of '${node.type}'!`)
}

export function isToken (x: any): x is Token {
  return !('children' in x)
}

export function isNode (x: any): x is CstNode {
  return 'children' in x
}
