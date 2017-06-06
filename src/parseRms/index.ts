import { Parser } from 'nearley'
import * as grammar from './grammar'

export function parse (input: string): { errors: Object[], ast?: RmsAst } {
  const parser = new Parser(grammar.ParserRules, grammar.ParserStart)
  try {
    parser.feed(input)
    return {
      ast: parser.results[0],
      errors: []
    }
  } catch (error) {
    return {
      errors: [error]
    }
  }
}

export type RmsAst = {
  type: 'RandomMapScript',
  statements: RmsTopLevelStatement[]
}

export type RmsTopLevelStatement = RmsSection | RmsConstDefinition | RmsFlagDefinition

export type RmsSection = {
  type: 'Section',
  name: string,
  statements: RmsSectionStatement[]
}

export type RmsSectionStatement = RmsCommand | RmsConstDefinition | RmsFlagDefinition

export type RmsCommand = {
  type: 'Command',
  name: string,
  value?: string | number,
  attributes?: RmsAttribute[]
}

export type RmsAttribute = {
  type: 'Attribute',
  name: string,
  value?: string | number
}

export type RmsConstDefinition = {
  type: 'ConstDefinition',
  name: string,
  value: number
}

export type RmsFlagDefinition = {
  type: 'FlagDefinition',
  flag: string
}
