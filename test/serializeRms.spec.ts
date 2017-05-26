import { serializeRms } from '../lib/index'
import { join } from 'path'
import { readFileSync } from 'fs'

const readSample = (name: string) => ({
  ast: JSON.parse(readFileSync(join(__dirname, 'samples', `${name}.ast`), 'utf8')),
  correctRms: readFileSync(join(__dirname, 'samples', `${name}.generated.rms`), 'utf8')
})

describe('serializeRms', () => {
  it('works on sections', () => {
    const { ast, correctRms } = readSample('sections')
    serializeRms(ast).should.equal(correctRms)
  })

  it('works on #const and #define', () => {
    const { ast, correctRms } = readSample('const-and-define')
    serializeRms(ast).should.equal(correctRms)
  })
})
