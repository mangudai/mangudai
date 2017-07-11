/**
 * Run this file with `ts-node` to generate JSON files in `./generated` from `.rms` libraries.
 */

import { parse, RmsAst } from '../'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const libs = ['aoc', 'dlc', 'userpatch']
libs.forEach(generateJsonFromLibFile)

function generateJsonFromLibFile (libname: string): void {
  console.log(`Parsing ${libname}...`)
  const { errors, ast } = parse(readFileSync(join(__dirname, `lib.${libname}.rms`), 'utf8'))
  if (errors.length) {
    throw new Error(`Cannot parse AST of lib '${libname}'! First error: ${errors[0].message}\n\n${errors[0].stack}`)
  } else {
    console.log('Generating definitions...')
    writeFileSync(join(__dirname, 'generated', `lib.${libname}.json`), astToJson(ast as RmsAst))
  }
}

function astToJson (ast: RmsAst): string {
  let section: string | undefined
  let lastComment: string | undefined
  const definitions: Definitions = {
    general: [],
    terrains: [],
    entities: []
  }

  ast.statements.forEach(statement => {
    switch (statement.type) {
      case 'Section':
        section = statement.name
        break
      case 'MultilineComment':
        lastComment = statement.comment.slice(3, statement.comment.length - 2).trim()
        break
      case 'ConstDefinition':
        addDefinition(definitions, section, statement.name, statement.value, lastComment)
        lastComment = undefined
        break
      case 'FlagDefinition':
        addDefinition(definitions, section, statement.flag, undefined, lastComment)
        lastComment = undefined
        break
      default:
        console.error(`Unexpected statement '${statement.type}'!`)
    }
  })

  return JSON.stringify(definitions, null, 2)
}

function addDefinition (definitions: Definitions, section?: string, name?: string, value?: number, comment?: string) {
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
