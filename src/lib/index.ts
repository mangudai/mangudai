import aoc from './generated/lib.aoc'
import dlc from './generated/lib.dlc'
import userpatch from './generated/lib.userpatch'

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
