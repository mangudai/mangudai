import { parse } from '../src/parse'
import { lex } from '../src/lex'
import { expect } from 'chai'

describe('parse', () => {
  const scripts: { [key: string]: string } = {
    'empty input': '',
    'spaces': '   \n\n   \n \t ',
    'comments': '/* comment one */ /* comment two */'
  }

  Object.keys(scripts).forEach(key => {
    it(`works on ${key}`, () => {
      const rms = scripts[key]
      const tokens = lex(rms).tokens
      const { ast, errors } = parse(tokens)
      expect(ast).to.be.an.instanceOf(Object)
      expect(errors).to.deep.equal([])
    })
  })
})
