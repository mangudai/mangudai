import { cloneDeep, RecursiveArray } from 'lodash'
import { Token } from 'moo'
import { NearleyRule } from './grammar'

/**
 * Wraps all user-defined grammar rule results into objects so it's possible
 * to distinguish them in the sea of nested arrays that nearley generates.
 * The rule nodes have `type` (rule name) and `children` (array of parsed parts).
 *
 * @param rules The raw nearley grammar rules.
 */
export function ruleNodesMiddleware ( rules: NearleyRule[]): NearleyRule[] {
  return rules.map(cloneDeep).map(rule => {
    if (!rule.name.includes('$')) {
      rule.postprocess = (parts): RuleNode => ({
        type: rule.name,
        children: parts
      })
    }
    return rule
  })
}

export type RuleNodeChildren = RecursiveArray<RuleNode | Token | null>
export type RuleNode = {
  type: string,
  children: RuleNodeChildren
}
