import { clearCache } from 'chevrotain'

// Chevrotain builds a cache of tokens that may appear in grammar.
// Re-running our files on `mocha --watch` creates same tokens
// with different ids which messes up CST parsing
// because unknown tokens suddenly appear.
clearCache()

import { parseRms } from '../lib/index'
import { expect } from 'chai'
import { join } from 'path'
import { readFileSync } from 'fs'

const readSample = (name: string) => readFileSync(join(__dirname, 'samples', `${name}.rms`), 'utf8')

describe('parseRms', () => {
  it('returns errors on illegal tokens', () => {
    const { ast, errors } = parseRms('=== wtf is this even ===')
    expect(ast).to.equal(undefined)
    expect(errors).to.not.deep.equal([])
  })

  it('returns CST visitor errors instead of throwing them', () => {
    const { ast, errors } = parseRms('<PLAYER_SETUP> whatever { #define }')
    expect(ast).to.equal(undefined)
    expect(errors).to.not.deep.equal([])
  })

  it('works on empty input', () => {
    const { ast, errors } = parseRms('')
    expect(ast).to.be.an.instanceOf(Object)
    expect(errors).to.deep.equal([])
  })

  it('works on spaces', () => {
    const { ast, errors } = parseRms('   \n\n   \n \t ')
    expect(ast).to.be.an.instanceOf(Object)
    expect(errors).to.deep.equal([])
  })

  it('works on comments', () => {
    const { ast, errors } = parseRms('/* comment one */ /* comment two */')
    expect(ast).to.be.an.instanceOf(Object)
    expect(errors).to.deep.equal([])
  })

  it('works on sections', () => {
    const { ast, errors } = parseRms(readSample('sections'))
    expect(ast).to.be.an.instanceOf(Object)
    expect(errors).to.deep.equal([])
  })

  it('works on #const and #define, both global and in sections', () => {
    const { ast, errors } = parseRms(readSample('const-and-define'))
    expect(ast).to.be.an.instanceOf(Object)
    expect(errors).to.deep.equal([])
  })
})
