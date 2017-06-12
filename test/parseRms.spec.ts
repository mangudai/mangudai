import { parseRms } from '../lib/index'
import { expect } from 'chai'
import { join } from 'path'
import { readFileSync } from 'fs'

const readSample = (name: string) => readFileSync(join(__dirname, 'samples', `${name}.rms`), 'utf8')
const readSampleAst = (name: string) => JSON.parse(readFileSync(join(__dirname, 'samples', 'generated', `${name}.ast`), 'utf8'))

describe('parseRms', () => {
  it('returns errors on illegal tokens', () => {
    const { ast, errors } = parseRms('=== wtf is this even ===')
    expect(errors).to.not.deep.equal([])
    expect(ast).to.equal(undefined)
  })

  it('returns CST visitor errors instead of throwing them', () => {
    const { ast, errors } = parseRms('<PLAYER_SETUP> whatever { #define }')
    expect(errors).to.not.deep.equal([])
    expect(ast).to.equal(undefined)
  })

  it('works on empty input', () => {
    const { ast, errors } = parseRms('')
    expect(errors).to.deep.equal([])
    expect(ast).to.be.an.instanceOf(Object)
  })

  it('works on spaces', () => {
    const { ast, errors } = parseRms('   \n\n   \n \t ')
    expect(errors).to.deep.equal([])
    expect(ast).to.be.an.instanceOf(Object)
  })

  it('works on sections', () => {
    const { ast, errors } = parseRms(readSample('sections'))
    expect(errors).to.deep.equal([])
    expect(ast).to.deep.equal(readSampleAst('sections'))
  })

  it('works on #const and #define, both global and in sections', () => {
    const { ast, errors } = parseRms(readSample('const-and-define'))
    expect(errors).to.deep.equal([])
    expect(ast).to.deep.equal(readSampleAst('const-and-define'))
  })

  it('works on if, elseif, else', () => {
    const { ast, errors } = parseRms(readSample('conditions'))
    expect(errors).to.deep.equal([])
    expect(ast).to.be.an.instanceOf(Object)
  })

  it('parses attributes with multiple arguments', () => {
    const { ast, errors } = parseRms(readSample('attribute-multiple-arguments'))
    expect(errors).to.deep.equal([])
    expect(ast).to.be.deep.equal(readSampleAst('attribute-multiple-arguments'))
  })

  it('parses comments everywhere', () => {
    const { ast, errors } = parseRms(readSample('comments-galore'))
    expect(errors).to.deep.equal([])
    expect(ast).to.be.deep.equal(readSampleAst('comments-galore'))
  })
})
