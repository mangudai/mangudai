/**
 * Run this file with `ts-node` to generate `.ast` files in this directory from `.rms` samples.
 */

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { basename, extname, join } from 'path'
import { parse } from '../../src/parseRms'
import { serialize } from '../../src/serializeRms'

const samples = readdirSync(__dirname)
  .filter(str => extname(str) === '.rms')
  .filter(str => !basename(str, '.rms').endsWith('.generated'))

samples.forEach(filename => {
  const rms = readFileSync(join(__dirname, filename), 'utf8')
  const ast = parse(rms).ast || null
  console.log(`Updating AST and RMS for ${filename}`)

  const serializedAst = JSON.stringify(ast, null, 2)
  const astFilename = basename(filename, '.rms') + '.ast'
  writeFileSync(join(__dirname, astFilename), serializedAst + '\n')

  const generatedRms = ast ? serialize(ast) : ''
  const generatedRmsFilename = basename(filename, '.rms') + '.generated.rms'
  writeFileSync(join(__dirname, generatedRmsFilename), generatedRms)
})
