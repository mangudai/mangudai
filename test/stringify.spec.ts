import { expect } from 'chai'
import { readdirSync, readFileSync } from 'fs'
import { basename, resolve } from 'path'
import { parse, stringify } from '../lib'

const readSampleFile = (name: string) => readFileSync(resolve(__dirname, 'samples', name), 'utf8')
const readSample = (name: string) => ({
  name,
  script: readSampleFile(`${name}.rms`),
  ast: JSON.parse(readSampleFile(`generated/${name}.ast.json`))
})

describe('stringify', () => {
  readdirSync(resolve(__dirname, 'samples'))
    .filter(str => str.endsWith('.rms'))
    .map(filename => readSample(basename(filename, '.rms')))
    .forEach(({ name, script, ast }) => {
      if (!ast.ast) {
        return
      }

      it(`losslessly stringifies example ${name}`, () => {
        const expected = parse(script)
        const result = parse(stringify(ast.ast))
        expect(result).to.deep.equal(expected)
      })
    })
})
