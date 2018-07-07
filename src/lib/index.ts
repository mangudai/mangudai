import { existsSync } from 'fs'
import { join } from 'path'

const aoc = existsSync(join(__dirname, 'generated')) && require('./generated/lib.aoc')
const dlc = existsSync(join(__dirname, 'generated')) && require('./generated/lib.dlc')
const userpatch = existsSync(join(__dirname, 'generated')) && require('./generated/lib.userpatch')

export { aoc, dlc, userpatch }
export { definitions as aocCommands } from './lib.aoc.commands'
export { definitions as dlcCommands } from './lib.dlc.commands'
export { definitions as userpatchCommands } from './lib.userpatch.commands'

export interface CommandDefinitions {
  [x: string]: {
    docs?: string,
    commands?: {
      [x: string]: {
        docs?: string,
        conflictsWith?: string,
        arguments?: { name: string, type: 'terrain' | 'number' | 'percentage' | 'entity' | 'elevation', default?: string | number }[],
        attributes?: {
          [x: string]: {
            docs?: string,
            conflictsWith?: string,
            arguments?: { name: string, type: 'terrain' | 'number' | 'percentage' | 'entity' | 'elevation', default?: string | number }[]
          }
        }
      }
    }
  }
}
