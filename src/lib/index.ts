let aoc
let dlc
let userpatch

try {
  // These files don't exist before first compilation in a fresh clone.
  // This ensures it is possible to compile for the first time without TypeScript errors.
  aoc = require('./generated/lib.aoc')
  dlc = require('./generated/lib.dlc')
  userpatch = require('./generated/lib.userpatch')
} catch (e) {} // tslint:disable-line:no-empty

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
