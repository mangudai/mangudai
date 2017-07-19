/**
 * Run this file with `ts-node` to generate `.ts` files in `./generated` from `.rms` libraries.
 */

import { parse, Script, DeclarationStatement } from '../'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const libs = ['aoc', 'dlc', 'userpatch']
libs.forEach(generateJsonFromLibFile)

function generateJsonFromLibFile (libname: string): void {
  console.log(`Generating definitions for ${libname}...`)
  const { errors, ast } = parse(readFileSync(join(__dirname, `lib.${libname}.rms`), 'utf8'))
  if (errors.length) {
    throw new Error(`Cannot parse AST of lib '${libname}'! First error: ${errors[0].message}\n\n${errors[0].stack}`)
  } else {
    const code = 'export default ' + astToJson(ast as Script)
    writeFileSync(join(__dirname, 'generated', `lib.${libname}.ts`), code)
  }
}

function astToJson (ast: Script): string {
  let section: string | undefined
  let lastDeclaration: DeclarationStatement | undefined
  const definitions: Definitions = {
    general: [],
    terrains: [],
    entities: []
  }

  ast.statements.forEach(statement => {
    switch (statement.type) {
      case 'SectionStatement':
        section = statement.name
        break
      case 'DeclarationStatement':
        if (lastDeclaration) {
          // There was a declaration before with no comment. We need to add it.
          addDefinition(definitions, lastDeclaration, section)
        }
        lastDeclaration = statement
        break
      case 'MultilineComment':
        if (lastDeclaration) {
          // There was a declaration right before this comment. Let's assume they are on the same line and this comment is description.
          addDefinition(definitions, lastDeclaration, section, statement.comment.trim())
          lastDeclaration = undefined
        }
        break
      default:
        console.error(`Unexpected statement '${statement.type}'!`)
    }
  })

  return JSON.stringify(definitions, null, 2)
}

function addDefinition (definitions: Definitions, { name, value }: DeclarationStatement, section?: string, comment?: string) {
  const type = (section || 'GENERAL').toLowerCase()
  definitions[type].push({
    name: (!name || name === '__noname') ? undefined : name,
    value: value,
    description: comment
  })
}

interface Definition {
  name?: string
  value?: number
  description?: string
}

interface Definitions {
  [x: string]: Definition[]
}
