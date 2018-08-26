import Printer from './printer'
import { AstNode } from '../parse/astTypes'

export function stringify (ast: AstNode) {
  const printer = new Printer(ast)
  return printer.generate()
}
