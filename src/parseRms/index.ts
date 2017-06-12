import { Parser } from 'nearley'
import { Lexer, ParserRules, ParserStart } from './grammar'

export function parse (input: string): { errors: Object[], ast?: RmsAst } {
  const parser = new Parser(ParserRules, ParserStart, { lexer: Lexer })
  try {
    parser.feed(input)
    if (parser.results.length > 1) {
      throw new Error('Ambiguous grammar! This is likely a problem with Mangudai itself, ' +
        'not your script. Please report this issue along with the script that caused it.')
    }
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

export type RmsTopLevelStatement = RmsSection | RmsConstDefinition | RmsFlagDefinition | RmsTopLevelIf | RmsMultilineComment
export interface RmsTopLevelIf extends RmsIf<RmsTopLevelStatement> {} // Microsoft/TypeScript#6230

export type RmsSection = {
  type: 'Section',
  name: string,
  statements: RmsSectionStatement[]
}

export type RmsSectionStatement = RmsCommand | RmsConstDefinition | RmsFlagDefinition | RmsSectionIf | RmsMultilineComment
export interface RmsSectionIf extends RmsIf<RmsSectionStatement> {} // Microsoft/TypeScript#6230

export type RmsCommand = {
  type: 'Command',
  name: string,
  args: (string | number)[],
  statements?: RmsCommandStatement[]
}

export type RmsCommandStatement = RmsAttribute | RmsCommandIf | RmsMultilineComment
export interface RmsCommandIf extends RmsIf<RmsCommandStatement> {} // Microsoft/TypeScript#6230

export type RmsAttribute = {
  type: 'Attribute',
  name: string,
  args: (string | number)[]
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

export type RmsMultilineComment = {
  type: 'MultilineComment',
  comment: string
}
