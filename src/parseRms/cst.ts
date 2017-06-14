import { NearleyRule } from './grammar'

export type CstNode = {
  type: string,
  children: any[]
}

export function cstMiddleware (rules: NearleyRule[]): void {
  rules.forEach(rule => {
    if (!rule.name.includes('$') && !rule.postprocess) {
      rule.postprocess = (parts): CstNode => ({
        type: rule.name,
        children: parts
      })
    }
  })
}
