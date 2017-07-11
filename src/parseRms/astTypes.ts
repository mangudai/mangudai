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

export interface RandomStatement<Child> extends AstNode {
  type: 'RandomStatement',
  statements: (RmsMultilineComment | ChanceStatement<Child>)[]
}

export interface ChanceStatement<Child> extends AstNode {
  type: 'ChanceStatement',
  chance: number,
  statements: Child[]
}

export type RmsTopLevelStatement = RmsSection | RmsConstDefinition | RmsFlagDefinition | RmsIncludeDrs | RmsTopLevelIf | TopLevelRandomStatement | RmsMultilineComment
export interface RmsTopLevelIf extends RmsIf<RmsTopLevelStatement> {} // Microsoft/TypeScript#6230
export interface TopLevelRandomStatement extends RandomStatement<RmsTopLevelStatement> {}

export interface RmsSection extends AstNode {
  type: 'Section',
  name: string,
  statements: RmsSectionStatement[]
}

export type RmsSectionStatement = RmsCommand | RmsConstDefinition | RmsFlagDefinition | RmsSectionIf | SectionRandomStatement | RmsMultilineComment
export interface RmsSectionIf extends RmsIf<RmsSectionStatement> {} // Microsoft/TypeScript#6230
export interface SectionRandomStatement extends RandomStatement<RmsSectionStatement> {}

export interface RmsCommand extends AstNode {
  type: 'Command',
  name: string,
  args: (string | number)[],
  preLeftCurlyComments?: RmsMultilineComment[],
  statements?: RmsCommandStatement[]
}

export type RmsCommandStatement = RmsAttribute | RmsCommandIf | CommandRandomStatement | RmsMultilineComment
export interface RmsCommandIf extends RmsIf<RmsCommandStatement> {} // Microsoft/TypeScript#6230
export interface CommandRandomStatement extends RandomStatement<RmsCommandStatement> {}

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
