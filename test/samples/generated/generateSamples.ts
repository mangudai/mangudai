/**
 * Run this file with `ts-node` to generate `.ast` files in this directory from `.rms` samples.
 */

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { basename, extname, join, resolve } from 'path'
import { parse } from '../../../src/parseRms'
import { serialize } from '../../../src/serializeRms'
import { lint } from '../../../src/lintRms'

const samples = readdirSync(resolve(__dirname, '..'))
  .filter(str => extname(str) === '.rms')

samples.forEach(filename => {
  const rms = readFileSync(resolve(__dirname, '..', filename), 'utf8')
  const ast = parse(rms).ast || null
  console.log(`Updating samples for ${filename}`)

  const serializedAst = JSON.stringify(ast, null, 2)
  const astFilename = basename(filename, '.rms') + '.ast.json'
  writeFileSync(join(__dirname, astFilename), serializedAst + '\n')

  const lintErrors = JSON.stringify(ast ? lint(ast) : [], null, 2)
  const lintFilename = basename(filename, '.rms') + '.lint-errors.json'
  writeFileSync(join(__dirname, lintFilename), lintErrors + '\n')

  const generatedRms = ast ? serialize(ast) : ''
  const generatedRmsFilename = basename(filename, '.rms') + '.generated.rms'
  writeFileSync(join(__dirname, generatedRmsFilename), generatedRms)
})
