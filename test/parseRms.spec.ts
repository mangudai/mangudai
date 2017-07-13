import { expect } from 'chai'
import { readdirSync, readFileSync } from 'fs'
import { basename, resolve } from 'path'
import { parse } from '../lib/index'

const readSampleFile = (name: string) => readFileSync(resolve(__dirname, 'samples', name), 'utf8')
const readSample = (name: string) => ({
  name,
  script: readSampleFile(`${name}.rms`),
  correctAst: JSON.parse(readSampleFile(`generated/${name}.ast.json`))
})

describe('parseRms', () => {
  readdirSync(resolve(__dirname, 'samples'))
    .filter(str => str.endsWith('.rms'))
    .map(filename => readSample(basename(filename, '.rms')))
    .forEach(({ name, script, correctAst }) => {
      it(`parses example ${name}`, () => {
        const result = parse(script)
        expect(result).to.deep.equal(correctAst)
      })
    })
})
