import { AstNode, Script, IfStatement, ElseIfStatement, RandomStatement,
  ChanceStatement, SectionStatement, CommandStatement,
  ConditionalCommandStatement, RandomCommandStatement, AttributeStatement,
  DeclarationStatement, MultilineComment, IncludeDrsStatement
} from '../parse/astTypes'
import Printer from './printer'

export function Script (this: Printer, node: AstNode) {
  const { statements } = node as Script
  this.printStatements(statements)
}

export function IfStatement (this: Printer, node: AstNode) {
  const {
    condition,
    statements,
    elseifs,
    elseStatements
  } = node as IfStatement
  this.push(`if ${condition}\n`)
  if (statements) {
    this.indent()
    this.printStatements(statements)
    this.dedent()
  }
  if (elseifs) {
    elseifs.forEach((elseif) => {
      this.print(elseif)
    })
  }
  if (elseStatements) {
    this.push('else\n')
    this.indent()
    this.printStatements(elseStatements)
    this.dedent()
  }
  this.push('endif')
}

export function ElseIfStatement (this: Printer, node: AstNode) {
  const { condition, statements } = node as ElseIfStatement
  this.push(`elseif ${condition}\n`)
  if (statements) {
    this.indent()
    this.printStatements(statements)
    this.dedent()
  }
}

export function RandomStatement (this: Printer, node: AstNode) {
  const { statements } = node as RandomStatement
  this.push('start_random\n')
  this.indent()
  this.printStatements(statements)
  this.dedent()
  this.push('end_random')
}

export function ChanceStatement (this: Printer, node: AstNode) {
  const { chance, statements } = node as ChanceStatement
  this.push(`percent_chance ${chance}\n`)
  this.indent()
  this.printStatements(statements)
  this.dedent()
}

export function SectionStatement (this: Printer, node: AstNode) {
  const { name, statements } = node as SectionStatement
  this.push(`<${name}>\n`)
  this.printStatements(statements)
}

export function CommandStatement (this: Printer, node: AstNode) {
  const { name, args, preLeftCurlyComments, statements } = node as CommandStatement
  this.push(name)
  if (args.length > 0) {
    this.push(` ${args.join(' ')}`)
  }
  if (preLeftCurlyComments) {
    this.push('\n')
    preLeftCurlyComments.forEach((comment) => {
      this.print(comment)
      this.push('\n')
    })
  } else {
    this.push(' ')
  }
  if (statements) {
    this.push('{\n')
    this.indent()
    this.printStatements(statements)
    this.dedent()
    this.push('}')
  }
}

export function ConditionalCommandStatement (this: Printer, node: AstNode) {
  const { header, preLeftCurlyComments, statements } = node as ConditionalCommandStatement
  this.print(header)
  this.push('\n')
  if (preLeftCurlyComments) {
    preLeftCurlyComments.forEach((comment) => {
      this.print(comment)
      this.push('\n')
    })
  }
  if (statements) {
    this.push('{\n')
    this.indent()
    this.printStatements(statements)
    this.dedent()
    this.push('}')
  }
}

export function RandomCommandStatement (this: Printer, node: AstNode) {
  const { header, preLeftCurlyComments, statements } = node as RandomCommandStatement
  this.print(header)
  this.push('\n')
  if (preLeftCurlyComments) {
    preLeftCurlyComments.forEach((comment) => {
      this.print(comment)
      this.push('\n')
    })
  }
  if (statements) {
    this.push('{\n')
    this.indent()
    this.printStatements(statements)
    this.dedent()
    this.push('}')
  }
}

export function AttributeStatement (this: Printer, node: AstNode) {
  const { name, args } = node as AttributeStatement
  this.push(`${name} ${args.join(' ')}`)
}

export function DeclarationStatement (this: Printer, node: AstNode) {
  const { kind, name, value } = node as DeclarationStatement
  this.push(`#${kind} ${name}`)
  if (value !== undefined) this.push(` ${value}`)
}

export function MultilineComment (this: Printer, node: AstNode) {
  const { comment } = node as MultilineComment
  this.push(`/*${comment}*/`)
}

export function IncludeDrsStatement (this: Printer, node: AstNode) {
  const { filename, id } = node as IncludeDrsStatement
  this.push(`#include_drs ${filename}`)
  if (id !== undefined) this.push(` ${id}`)
}
