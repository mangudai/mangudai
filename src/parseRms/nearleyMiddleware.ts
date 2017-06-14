import { Parser } from 'nearley'
import { NearleyRule } from './grammar'

export type Visitor<T> = { [x: string]: (node: any) => T }

/**
 * Maps CST/AST nodes with specified functions. The order of visits is bottom-up,
 * meaning that all child nodes are already visited in any given visitor method.
 *
 * Under the hood it just adds postprocessors to rules, wrapping existing ones.
 * Your visitor methods will be called with the stuff returned from existing postprocessors.
 *
 * @param rules Grammar rules from a compiled `.ne` file
 * @param visitorMap A map of visitor methods that get a node and return a visited node
 */
export function visitorMiddleware (rules: NearleyRule[], visitorMap: Visitor<any>): void {
  rules.forEach(rule => {
    if (rule.name in visitorMap) {
      const originalPostprocess = ('postprocess' in rule) ? rule.postprocess : null

      rule.postprocess = (parts, loc, reject) => {
        const node = originalPostprocess ? originalPostprocess(parts, loc, reject) : parts
        return visitorMap[rule.name](node)
      }
    }
  })
}

/**
 * Wraps specified postprocessors into a function that rejects parsings if the given predicate is true.
 *
 * @param rules Grammar rules from a compiled `.ne` file
 * @param rejectMap A map of predicates that decide whether to reject a given parsing (`true` means reject)
 */
export function rejectMiddleware (rules: NearleyRule[], rejectMap: Visitor<boolean>): void {
  const visitor: Visitor<any> = {}
  for (let name in rejectMap) {
    if (rejectMap.hasOwnProperty(name)) visitor[name] = node => rejectMap[name](node) ? Parser.fail : node
  }

  visitorMiddleware(rules, visitor)
}
