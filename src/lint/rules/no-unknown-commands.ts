/// <reference path="meant/index.d.ts">
import { LintError } from '../'
import { Script, CommandStatement } from '../../parse'
import { getToken, getNodes } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'
import * as meant from 'meant'

const COMMAND_NAMES = [
  'random_placement',
  'grouped_by_team',
  'base_terrain',
  'create_player_lands',
  'create_land',
  'min_number_of_cliffs',
  'max_number_of_cliffs',
  'min_length_of_cliff',
  'max_length_of_cliff',
  'cliff_curliness',
  'min_distance_cliffs',
  'min_terrain_distance',
  'create_terrain',
  'create_object',
  'create_connect_all_players_land',
  'create_connect_teams_land',
  'create_connect_same_land_zones',
  'create_connect_all_lands',
  'create_elevation',
  'replace_terrain'
]

function didYouMean (name: string) {
  const closest = meant(name, COMMAND_NAMES)
  if (closest.length === 0) return ''
  return ` Did you mean '${closest[0]}'?`
}

export function check (ast: Script): LintError[] {
  const unknownCommands: CommandStatement[] = []

  const commands = getNodes(ast, 'CommandStatement') as CommandStatement[]
  commands.forEach(cmd => {
    if (COMMAND_NAMES.indexOf(cmd.name) === -1) {
      unknownCommands.push(cmd)
    }
  })

  return unknownCommands.map<LintError>(x => ({
    name: 'LintError',
    message: `Unknown command '${x.name}'.${didYouMean(x.name)}`,
    boundaries: {
      start: getBoundaries(getToken(x, undefined, true)).start,
      end: getBoundaries(getToken(x, undefined, true)).end
    }
  }))
}
