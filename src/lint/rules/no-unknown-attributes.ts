/// <reference path="meant/index.d.ts">
import { LintError } from '../'
import { Script, AttributeStatement } from '../../parse'
import { getToken, getChildNodes, getNodes, getLastToken } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'
import * as meant from 'meant'

const ATTRIBUTE_NAMES = [
  'min_distance',
  'max_distance',
  'set_position',
  'land_percent',
  'land_position',
  'land_id',
  'base_terrain',
  'terrain_type',
  'base_size',
  'left_border',
  'right_border',
  'top_border',
  'bottom_border',
  'border_fuzziness',
  'zone',
  'set_zone_by_team',
  'set_zone_randomly',
  'other_zone_avoidance_distance',
  'assign_to_player',
  'min_terrain_distance',
  'percent_of_land',
  'number_of_clumps',
  'spacing_to_other_terrain_types',
  'set_scaling_to_map_size',
  'number_of_groups',
  'number_of_objects',
  'group_variance',
  'group_placement_radius',
  'set_loose_grouping',
  'set_tight_grouping',
  'terrain_to_place_on',
  'set_gaia_object_only',
  'set_place_for_every_player',
  'place_on_specific_land_id',
  'min_distance_to_players',
  'max_distance_to_players',
  'clumping_factor',
  'number_of_tiles',
  'set_scale_by_groups',
  'set_scale_by_size',
  'set_avoid_player_start_areas',
  'min_distance_group_placement',
  'spacing',
  'default_terrain_placement',
  'terrain_cost',
  'terrain_size',
  'min_placement_distance',
  'set_scaling_to_player_number',
  'height_limits',
  'set_flat_terrain_only',
  'max_distance_to_other_zones',
  'temp_min_distance_group_placement'
]

function didYouMean (name: string) {
  const closest = meant(name, ATTRIBUTE_NAMES)
  if (closest.length === 0) return ''
  return ` Did you mean '${closest[0]}'?`
}

export function check (ast: Script): LintError[] {
  const unknownAttributes: AttributeStatement[] = []

  getNodes(ast, 'StatementsBlock').forEach(block => {
    const attributes = getChildNodes(block, 'Attribute') as AttributeStatement[]
    attributes.forEach(attr => {
      if (ATTRIBUTE_NAMES.indexOf(attr.name) === -1) {
		  unknownAttributes.push(attr)
      }
    })
  })

  return unknownAttributes.map<LintError>(x => ({
    name: 'LintError',
    message: `Unknown attribute '${x.name}'.${didYouMean(x.name)}`,
    boundaries: {
      start: getBoundaries(getToken(x, undefined, true)).start,
      end: getBoundaries(getLastToken(x, undefined, true)).end
    }
  }))
}
