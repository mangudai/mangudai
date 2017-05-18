import { parse } from '../src/parse'
import { expect } from 'chai'

describe('parse', () => {
  const NO_ERRORS = { lexer: [], parser: [] }

  it('works on empty input', () => {
    const { ast, errors } = parse('')
    expect(ast).to.be.an.instanceOf(Object)
    expect(errors).to.deep.equal(NO_ERRORS)
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
    const { ast, errors } = parse('<PLAYER_SETUP>\n<OBJECTS_GENERATION>')
    expect(ast).to.be.an.instanceOf(Object)
    expect(errors).to.deep.equal(NO_ERRORS)
  })

  it('returns errors on illegal tokens', () => {
    const { ast, errors } = parse('--- wtf is this even ---')
    expect(ast).to.be.an.instanceOf(Object)
    expect(errors).to.not.deep.equal(NO_ERRORS)
  })
})
