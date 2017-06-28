import { CstNode, CstNodeChild } from './cst'
import { Token } from 'moo'

const descendantsCache = new WeakMap<CstNode, CstNodeChild[]>()

export function getChildren (node: CstNode, type: string): CstNodeChild[] {
  if (type in node.childrenByType) return node.childrenByType[type]
  else return []
}

export function getFirstChild (node: CstNode, type: string): CstNodeChild | undefined {
  if (type in node.childrenByType && node.childrenByType[type].length) {
    return node.childrenByType[type][0]
  }
}

export function getDescendants (node: CstNode, type: string): CstNodeChild[] {
  if (descendantsCache.has(node)) return descendantsCache.get(node) as CstNode[] | Token[]

  let descendants: CstNodeChild[] = []
  node.children.forEach(x => {
    if (x.type === type) descendants.push(x)
    if ('children' in x) descendants = [...descendants, ...getDescendants(x as CstNode, type)]
  })
  descendantsCache.set(node, descendants)
  return descendants
}

export function getFirstDescendant (node: CstNode, type: string): CstNodeChild | undefined {
  const all = getDescendants(node, type)
  return all.length ? all[0] : undefined
}
