import { parseRms } from '../lib/index'
import { expect } from 'chai'
import { readdirSync, readFileSync } from 'fs'
import { basename, extname, resolve } from 'path'

const readSampleFile = (name: string) => readFileSync(resolve(__dirname, 'samples', name), 'utf8')
const readSample = (name: string) => ({
  name,
  script: readSampleFile(`${name}.rms`),
  correctAst: JSON.parse(readSampleFile(`generated/${name}.ast`))
})

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

  readdirSync(resolve(__dirname, 'samples'))
    .filter(str => extname(str) === '.rms')
    .map(filename => readSample(basename(filename, '.rms')))
    .forEach(({ name, script, correctAst }) => {
      it(`parses example ${name}`, () => {
        const { ast, errors } = parseRms(script)
        expect(errors).to.deep.equal([])
        expect(ast).to.deep.equal(correctAst)
      })
    })
})
