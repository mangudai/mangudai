import { Parser } from 'nearley'
import { Lexer, ParserRules, ParserStart } from './grammar'

export function parse (input: string): { errors: Object[], ast?: RmsAst } {
  const parser = new Parser(ParserRules, ParserStart, { lexer: Lexer })
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

export type RmsIf<Child> = {
  type: 'If',
  condition: string,
  statements?: Child[],
  elseifs?: { condition: string, statements?: Child[] }[],
  elseStatements?: Child[]
}

export type RmsTopLevelStatement = RmsSection | RmsConstDefinition | RmsFlagDefinition | RmsTopLevelIf
export interface RmsTopLevelIf extends RmsIf<RmsTopLevelStatement> {} // Microsoft/TypeScript#6230

export type RmsSection = {
  type: 'Section',
  name: string,
  statements: RmsSectionStatement[]
}

export type RmsSectionStatement = RmsCommand | RmsConstDefinition | RmsFlagDefinition | RmsSectionIf
export interface RmsSectionIf extends RmsIf<RmsSectionStatement> {} // Microsoft/TypeScript#6230

export type RmsCommand = {
  type: 'Command',
  name: string,
  value?: string | number,
  statements?: RmsCommandStatement[]
}

export type RmsCommandStatement = RmsAttribute | RmsCommandIf
export interface RmsCommandIf extends RmsIf<RmsCommandStatement> {} // Microsoft/TypeScript#6230

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
