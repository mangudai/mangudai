import { serializeRms } from '../lib/index'
import { readdirSync, readFileSync } from 'fs'
import { basename, extname, resolve } from 'path'

const readSampleFile = (name: string) => readFileSync(resolve(__dirname, 'samples', name), 'utf8')
const readSample = (name: string) => ({
  name,
  ast: JSON.parse(readSampleFile(`generated/${name}.ast`)),
  correctSerialized: readSampleFile(`generated/${name}.generated.rms`)
})

describe('serializeRms', () => {
  readdirSync(resolve(__dirname, 'samples'))
    .filter(str => extname(str) === '.rms')
    .map(filename => readSample(basename(filename, '.rms')))
    .forEach(({ name, ast, correctSerialized }) => {
      it(`serializes example ${name}`, () => {
        serializeRms(ast).should.equal(correctSerialized)
      })
    })
})
