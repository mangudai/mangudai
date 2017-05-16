import { lex } from '../src/lex'
import { readFileSync } from 'fs'
import { resolve } from 'path'

describe('lex', () => {
  it('works on valid input', () => {
    const rms = readFileSync(resolve(__dirname, './samples/valid.rms'), 'utf8')
    const result = lex(rms)

    result.errors.length.should.equal(0)
  })

  it('works on invalid input', () => {
    const rms = readFileSync(resolve(__dirname, './samples/invalid.rms'), 'utf8')
    const result = lex(rms)

    result.errors.length.should.be.above(0)
  })
})
