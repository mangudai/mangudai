/**
 * Run this file with `ts-node` to generate `.ast` files in this directory from `.rms` samples.
 */

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { basename, extname, join } from 'path'
import { parse } from '../../src/parseRms'

readdirSync(__dirname).filter(str => extname(str) === '.rms').forEach(filename => {
  console.log(`Updating AST for ${filename}`)
  const rms = readFileSync(join(__dirname, filename), 'utf8')
  const ast = parse(rms).ast
  const serializedAst = JSON.stringify(ast, null, 2)
  const astFilename = basename(filename, '.rms') + '.ast'
  writeFileSync(join(__dirname, astFilename), serializedAst + '\n')
})
