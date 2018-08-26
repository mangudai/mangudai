import { AstNode } from '../parse/astTypes'
import * as nodes from './nodes'

type PrintFns = {
  [key: string]: (this: Printer, node: AstNode) => void
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
      this.result += '  '
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
    const print = (nodes as PrintFns)[node.type]
    if (!print) {
      throw new Error(`Unknown node type '${node.type}'`)
    }
    return print.call(this, node)
  }

  printStatements (statements: AstNode[]) {
    statements.forEach((stmt) => {
      this.print(stmt)
      this.push('\n')
    })
  }
}
