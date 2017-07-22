export { definitions as aocDeclarations } from './generated/lib.aoc'
export { definitions as aocCommands } from './lib.aoc.commands'
export { definitions as dlcDeclarations } from './generated/lib.dlc'
export { definitions as dlcCommands } from './lib.dlc.commands'
export { definitions as userpatchDeclarations } from './generated/lib.userpatch'
export { definitions as userpatchCommands } from './lib.userpatch.commands'

export interface DeclarationDefinitions {
  [x: string]: {
    name?: string,
    value?: string | number,
    description: string
  }[]
}

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
