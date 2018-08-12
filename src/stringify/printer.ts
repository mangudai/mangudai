import { AstNode, Script, IfStatement, ElseIfStatement, RandomStatement, ChanceStatement, SectionStatement, CommandStatement, ConditionalCommandStatement, RandomCommandStatement, AttributeStatement, DeclarationStatement, MultilineComment, IncludeDrsStatement } from '../parse/astTypes'

type Printers = {
  [key: string]: (this: Printer, node: AstNode) => void
}

const printers: Printers = {
  Script (this: Printer, node: AstNode) {
    const { statements } = node as Script
    this.printStatements(statements)
  },
  IfStatement (this: Printer, node: AstNode) {
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
  },
  ElseIfStatement (this: Printer, node: AstNode) {
    const { condition, statements } = node as ElseIfStatement
    this.push(`elseif ${condition}\n`)
    if (statements) {
      this.indent()
      this.printStatements(statements)
      this.dedent()
    }
  },
  RandomStatement (this: Printer, node: AstNode) {
    const { statements } = node as RandomStatement
    this.push('start_random\n')
    this.indent()
    this.printStatements(statements)
    this.dedent()
    this.push('end_random')
  },
  ChanceStatement (this: Printer, node: AstNode) {
    const { chance, statements } = node as ChanceStatement
    this.push(`percent_chance ${chance}\n`)
    this.indent()
    this.printStatements(statements)
    this.dedent()
  },
  SectionStatement (this: Printer, node: AstNode) {
    const { name, statements } = node as SectionStatement
    this.push(`<${name}>\n`)
    this.printStatements(statements)
  },
  CommandStatement (this: Printer, node: AstNode) {
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
  },
  ConditionalCommandStatement (this: Printer, node: AstNode) {
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
  },
  RandomCommandStatement (this: Printer, node: AstNode) {
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
  },
  AttributeStatement (this: Printer, node: AstNode) {
    const { name, args } = node as AttributeStatement
    this.push(`${name} ${args.join(' ')}`)
  },
  DeclarationStatement (this: Printer, node: AstNode) {
    const { kind, name, value } = node as DeclarationStatement
    this.push(`#${kind} ${name}`)
    if (value !== undefined) this.push(` ${value}`)
  },
  MultilineComment (this: Printer, node: AstNode) {
    const { comment } = node as MultilineComment
    this.push(`/*${comment}*/`)
  },
  IncludeDrsStatement (this: Printer, node: AstNode) {
    const { filename, id } = node as IncludeDrsStatement
    this.push(`#include_drs ${filename}`)
    if (id !== undefined) this.push(` ${id}`)
  }
}

export default class Printer {
  private ast: AstNode
  private result: string
  private indentation: number

  constructor (ast: AstNode) {
    this.ast = ast
    this.result = ''
    this.indentation = 0
  }

  generate () {
    this.print(this.ast)
    return this.result
  }

  indent () {
    // Indent the current line.
    if (/\n *$/.test(this.result.slice(-1 - this.indentation))) {
      this.result += '  ';
    }
    this.indentation += 2
  }

  dedent () {
    this.indentation -= 2
    // Undo indentation on the current line
    if (/\n {2,}$/.test(this.result)) {
      this.result = this.result.slice(0, -2)
    }
  }

  push (str: string) {
    this.result += this.indentation > 0
      ? str.replace(/\n/g, `\n${' '.repeat(this.indentation)}`)
      : str
  }

  print (node: AstNode) {
    const print = printers[node.type]
    if (!print) throw new Error(`Unknown node type '${node.type}'`)
    return print.call(this, node)
  }

  printStatements (statements: AstNode[]) {
    statements.forEach((stmt) => {
      this.print(stmt)
      this.push('\n')
    })
  }
}
