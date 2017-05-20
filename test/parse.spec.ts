import { clearCache } from 'chevrotain'

// Chevrotain builds a cache of tokens that may appear in grammar.
// Re-running our files on `mocha --watch` creates same tokens
// with different ids which messes up CST parsing
// because unknown tokens suddenly appear.
clearCache()

import { parse } from '../src/parse'
import { expect } from 'chai'
import { join } from 'path'
import { readFileSync } from 'fs'

const readSample = (name: string) => readFileSync(join(__dirname, 'samples', `${name}.rms`), 'utf8')

describe('parse', () => {
  const NO_ERRORS = { lexer: [], parser: [] }

  it('returns errors on illegal tokens', () => {
    const { ast, errors } = parse('--- wtf is this even ---')
    expect(ast).to.be.an.instanceOf(Object)
    expect(errors).to.not.deep.equal(NO_ERRORS)
  })

  it('works on empty input', () => {
    const { ast, errors } = parse('')
    expect(ast).to.be.an.instanceOf(Object)
    expect(errors).to.deep.equal(NO_ERRORS)
  })

  it('works on spaces', () => {
    const { ast, errors } = parse('   \n\n   \n \t ')
    expect(ast).to.be.an.instanceOf(Object)
    expect(errors).to.deep.equal(NO_ERRORS)
  })

  it('works on comments', () => {
    const { ast, errors } = parse('/* comment one */ /* comment two */')
    expect(ast).to.be.an.instanceOf(Object)
    expect(errors).to.deep.equal(NO_ERRORS)
  })

  it('works on sections', () => {
    const { ast, errors } = parse(readSample('sections'))
    expect(ast).to.be.an.instanceOf(Object)
    expect(errors).to.deep.equal(NO_ERRORS)
  })

  it('works on constant definitions', () => {
    const { ast, errors } = parse(readSample('constants'))
    expect(ast).to.be.an.instanceOf(Object)
    expect(errors).to.deep.equal(NO_ERRORS)
  })
})
