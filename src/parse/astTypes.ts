import { CstNode } from './cst'

export interface AstNode extends CstNode {}

export interface Script extends AstNode {
  type: 'Script',
  statements: Statement[]
}

export type Statement = TopLevelStatement | SectionLevelStatement | CommandLevelStatement

export type TopLevelStatement = CommonStatement | SectionStatement
export type SectionLevelStatement = CommonStatement | CommandStatement | ConditionalCommandStatement
export type CommandLevelStatement = CommonStatement | AttributeStatement

export type CommonStatement =
  IfStatement |
  RandomStatement |
  ChanceStatement |
  DeclarationStatement |
  IncludeDrsStatement |
  MultilineComment

export interface IfStatement extends AstNode {
  type: 'IfStatement',
  condition: string,
  statements?: Statement[],
  elseifs?: ElseIfStatement[],
  elseStatements?: Statement[]
}

export interface ElseIfStatement extends AstNode {
  type: 'ElseIfStatement'
  condition: string,
  statements?: Statement[]
}

export interface RandomStatement extends AstNode {
  type: 'RandomStatement',
  statements: (MultilineComment | ChanceStatement)[]
}

export interface ChanceStatement extends AstNode {
  type: 'ChanceStatement',
  chance: number,
  statements: Statement[]
}

export interface SectionStatement extends AstNode {
  type: 'SectionStatement',
  name: string,
  statements: Statement[]
}

export interface CommandStatement extends AstNode {
  type: 'CommandStatement',
  name: string,
  args: (string | number)[],
  preLeftCurlyComments?: MultilineComment[],
  statements?: Statement[]
}

export interface ConditionalCommandStatement extends AstNode {
  type: 'ConditionalCommandStatement',
  header: IfStatement,
  preLeftCurlyComments?: MultilineComment[],
  statements?: Statement[]
}

export interface RandomCommandStatement extends AstNode {
  type: 'RandomCommandStatement',
  header: RandomStatement,
  preLeftCurlyComments?: MultilineComment[],
  statements?: Statement[]
}

export interface AttributeStatement extends AstNode {
  type: 'AttributeStatement',
  name: string,
  args: (string | number)[]
}

export interface DeclarationStatement extends AstNode {
  type: 'DeclarationStatement',
  kind: 'const' | 'define',
  name: string,
  value?: number
}

export interface MultilineComment extends AstNode {
  type: 'MultilineComment',
  comment: string
}

export interface IncludeDrsStatement extends AstNode {
  type: 'IncludeDrsStatement',
  filename: string,
  id?: number
}
