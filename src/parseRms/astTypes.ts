import { CstNode } from './cst'

export interface AstNode extends CstNode {}

export interface RmsAst extends AstNode {
  type: 'RandomMapScript',
  statements: RmsTopLevelStatement[]
}

export interface RmsIf<Child> extends AstNode {
  type: 'IfStatement',
  condition: string,
  statements?: Child[],
  elseifs?: ElseIf<Child>[],
  elseStatements?: Child[]
}

export interface ElseIf<Child> extends AstNode {
  type: 'ElseIfStatement'
  condition: string,
  statements?: Child[]
}

export type RmsTopLevelStatement = RmsSection | RmsConstDefinition | RmsFlagDefinition | RmsIncludeDrs | RmsTopLevelIf | RmsMultilineComment
export interface RmsTopLevelIf extends RmsIf<RmsTopLevelStatement> {} // Microsoft/TypeScript#6230

export interface RmsSection extends AstNode {
  type: 'Section',
  name: string,
  statements: RmsSectionStatement[]
}

export type RmsSectionStatement = RmsCommand | RmsConstDefinition | RmsFlagDefinition | RmsSectionIf | RmsMultilineComment
export interface RmsSectionIf extends RmsIf<RmsSectionStatement> {} // Microsoft/TypeScript#6230

export interface RmsCommand extends AstNode {
  type: 'Command',
  name: string,
  args: (string | number)[],
  statements?: RmsCommandStatement[]
}

export type RmsCommandStatement = RmsAttribute | RmsCommandIf | RmsMultilineComment
export interface RmsCommandIf extends RmsIf<RmsCommandStatement> {} // Microsoft/TypeScript#6230

export interface RmsAttribute extends AstNode {
  type: 'Attribute',
  name: string,
  args: (string | number)[]
}

export interface RmsConstDefinition extends AstNode {
  type: 'ConstDefinition',
  name: string,
  value: number
}

export interface RmsFlagDefinition extends AstNode {
  type: 'FlagDefinition',
  flag: string
}

export interface RmsMultilineComment extends AstNode {
  type: 'MultilineComment',
  comment: string
}

export interface RmsIncludeDrs extends AstNode {
  type: 'IncludeDrs',
  filename: string,
  id?: number
}
