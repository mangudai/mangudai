import { CommandDefinitions } from './'

export const definitions: CommandDefinitions = {
  'PLAYER_SETUP': {
    docs: 'Change general player settings.',
    commands: {
      'random_placement': {
        docs: 'Place players in random parts of the map. You can omit this because it is the default.'
      }
    }
  },
  'LAND_GENERATION': {
    docs: 'Create basic territories: player starting lands, grass continents on a water base, etc.',
    commands: {
      'base_terrain': {
        docs: 'Set the base terrain. Initially, the map is filled with this terrain type.',
        arguments: [
          { name: 'TERRAIN', type: 'terrain', default: 'GRASS' }
        ]
      },
      'create_player_lands': {
        docs: 'Create starting lands for all players. Use multiple times to add multiple towns for each player. If you create no player lands at all, you can\'t place starting units and resources, only a Town Center and villagers randomly placed on the map.',
        attributes: {
          'terrain_type': {
            docs: 'Set a terrain type different from the base terrain.',
            arguments: [
              { name: 'TERRAIN', type: 'terrain', default: 'GRASS' }
            ]
          },
          'land_percent': {
            docs: 'Total size of all player lands as a percentage of the map size.',
            arguments: [
              { name: 'PERCENT', type: 'percentage', default: 100 }
            ],
            conflictsWith: 'number_of_tiles'
          },
          'number_of_tiles': {
            docs: 'Size of each player land as a fixed number of tiles.',
            arguments: [
              { name: 'N', type: 'number' }
            ]
          },
          'base_size': {
            docs: 'Enforce minimum width and height of each player land even when `land_percent` and `number_of_tiles` are small. If `base_size` is higher than land size, the land becomes more like a square. Value 10 means 10x10 tiles minimum land size.',
            arguments: [
              { name: 'N', type: 'number', default: 0 }
            ]
          },
          'left_border': {
            docs: 'Minimum distance from SW border as a percentage of the map width.',
            arguments: [
              { name: 'PERCENT', type: 'percentage', default: 0 }
            ]
          },
          'right_border': {
            docs: 'Minimum distance from NE border as a percentage of the map width.',
            arguments: [
              { name: 'PERCENT', type: 'percentage', default: 0 }
            ]
          },
          'top_border': {
            docs: 'Minimum distance from NW border as a percentage of the map width. To avoid crashes, set at least one of the other three borders.',
            arguments: [
              { name: 'PERCENT', type: 'percentage', default: 0 }
            ]
          },
          'bottom_border': {
            docs: 'Minimum distance from SE border as a percentage of the map width.',
            arguments: [
              { name: 'PERCENT', type: 'percentage', default: 0 }
            ]
          },
          'border_fuzziness': {
            docs: 'Border regularity. Value 100 means completely square, 0 means extremely irregular outside the borders. Values 5-20 make edges ragged and natural.',
            arguments: [
              { name: 'PERCENT', type: 'percentage' }
            ]
          },
          'clumping_factor': {
            docs: 'Shape regularity. Value 100 means close to a perfect circle, 0 means weird snaky lands. Use `base_size` to enforce minimum width.',
            arguments: [
              { name: 'PERCENT', type: 'percentage', default: 8 }
            ]
          },
          'zone': {
            docs: 'Assign all player lands to a zone to use in `other_zone_avoidance_distance`. By default, each player land is a different zone like on Islands, non-player lands are all in the same zone. Use any number. Value 99 leads to a crash, but 100 and above work again.',
            arguments: [
              { name: 'N', type: 'number' }
            ]
          },
          'set_zone_randomly': {
            docs: 'Assign each player land to a random zone to use in `other_zone_avoidance_distance`. Some players may share a zone like on Archipelago. Use any number. Value 99 leads to a crash, but 100 and above work again.'
          },
          'set_zone_by_team': {
            docs: 'Assign each player land to a zone grouping by team. Allies will share the same zone like on Team Islands. Use any number. Value 99 leads to a crash, but 100 and above work again.'
          },
          'other_zone_avoidance_distance': {
            docs: 'Minimum distance, in tiles, to zones of other player lands (see `zone`, `set_zone_randomly`, `set_zone_by_team`). Useful to keep islands separated, etc. If two lands have different values, the smaller avoidance distance will be used.',
            arguments: [
              { name: 'N', type: 'number' }
            ]
          }
        }
      },
      'create_land': {
        docs: 'Creates a generic land. It\'s called "land" but it can also be a lake or any other terrain type. Use `assign_to_player` if you want to create different towns for different players.',
        attributes: {
          'terrain_type': {
            docs: 'Set a terrain type different from the base terrain.',
            arguments: [
              { name: 'TERRAIN', type: 'terrain', default: 'GRASS' }
            ]
          },
          'land_percent': {
            docs: 'The size of the land as a percentage of the map size.',
            arguments: [
              { name: 'PERCENT', type: 'percentage', default: 100 }
            ],
            conflictsWith: 'number_of_tiles'
          },
          'number_of_tiles': {
            docs: 'The size of the land as a fixed number of tiles.',
            arguments: [
              { name: 'N', type: 'number' }
            ]
          },
          'base_size': {
            docs: 'Enforce minimum width and height of the land even when `land_percent` and `number_of_tiles` are small. If `base_size` is higher than land size, the land becomes more like a square. Value 10 means 10x10 tiles minimum land size.',
            arguments: [
              { name: 'N', type: 'number', default: 0 }
            ]
          },
          'left_border': {
            docs: 'Minimum distance from SW border as a percentage of the map width.',
            arguments: [
              { name: 'PERCENT', type: 'percentage', default: 0 }
            ]
          },
          'right_border': {
            docs: 'Minimum distance from NE border as a percentage of the map width.',
            arguments: [
              { name: 'PERCENT', type: 'percentage', default: 0 }
            ]
          },
          'top_border': {
            docs: 'Minimum distance from NW border as a percentage of the map width. To avoid crashes, set at least one of the other three borders.',
            arguments: [
              { name: 'PERCENT', type: 'percentage', default: 0 }
            ]
          },
          'bottom_border': {
            docs: 'Minimum distance from SE border as a percentage of the map width.',
            arguments: [
              { name: 'PERCENT', type: 'percentage', default: 0 }
            ]
          },
          'land_position': {
            docs: 'Set fixed position of the center of the land. `land_position 50 50` means exactly the center of the map. Setting Y coordinate to 100 leads to a crash. The land will not be created if the specified position is outside of borders set with `left_border`, `right_border`, `top_border`, `bottom_border`.',
            arguments: [
              { name: 'X', type: 'percentage', default: 0 },
              { name: 'Y', type: 'percentage', default: 0 }
            ],
            conflictsWith: 'assign_to_player'
          },
          'border_fuzziness': {
            docs: 'Border regularity. Value 100 means smooth border, 0 means extremely irregular outside the borders. Values 5-20 make edges ragged and natural.',
            arguments: [
              { name: 'PERCENT', type: 'percentage' }
            ]
          },
          'clumping_factor': {
            docs: 'Shape regularity. Value 100 means close to a perfect circle, 0 means weird snake lands. Use `base_size` to enforce minimum width.',
            arguments: [
              { name: 'PERCENT', type: 'percentage', default: 8 }
            ]
          },
          'zone': {
            docs: 'Assign the land to a zone to use in `other_zone_avoidance_distance`. By default, each player land is a different zone like on Islands, non-player lands are all in the same zone. Use any number. Value 99 leads to a crash, but 100 and above work again.',
            arguments: [
              { name: 'N', type: 'number' }
            ]
          },
          'set_zone_randomly': {
            docs: 'Assign the land to a random zone to use in `other_zone_avoidance_distance`. Some lands may share a zone. Use any number. Value 99 leads to a crash, but 100 and above work again.'
          },
          'other_zone_avoidance_distance': {
            docs: 'Minimum distance, in tiles, to lands of other zones (see `zone`, `set_zone_randomly`). Useful to keep islands separated, etc. If two lands have different values, the smaller avoidance distance will be used.',
            arguments: [
              { name: 'N', type: 'number' }
            ]
          },
          'land_id': {
            docs: 'Assign a numeric label to the land to use in `create_object` commands with `place_on_specific_land_id` attribute. Land must be separated from others by water or other terrain where the objects can\'t be placed (shallow, ice, ...). Assign the same id to multiple lands to place objects on each of them. This attribute is not related to zones (see `zone`).',
            arguments: [
              { name: 'N', type: 'number' }
            ]
          },
          'assign_to_player': {
            docs: 'Make this land player\'s (1-8) starting position. An alternative to `create_player_lands`. Assign 8 different lands to 8 players to support up to 8 players. Player number refers to position in lobby, not color (player 1 is first name on list, not necessarily blue). If some players are not playing, their lands won\'t be created. To create unequal starts, use this together with `create_object` command with `terrain_to_place_on` attribute.',
            arguments: [
              { name: 'PLAYER', type: 'number' }
            ]
          }
        }
      }
    }
  },
  'ELEVATION_GENERATION': {
    docs: 'Create smooth and walkable hills. They automatically avoid players\' starting areas.',
    commands: {
      'create_elevation': {
        docs: 'Creates one or more hills with random height, up to a specified limit. Generally, hills with larger base reach greater height.',
        arguments: [
          { name: 'MAX_HEIGHT', type: 'elevation' }
        ],
        attributes: {
          'base_terrain': {
            docs: 'Create hills only on a certain terrain.',
            arguments: [
              { name: 'TERRAIN', type: 'terrain' }
            ]
          },
          'number_of_tiles': {
            docs: 'Total base size of all hills as a number of tiles.',
            arguments: [
              { name: 'N', type: 'number', default: 100 }
            ]
          },
          'number_of_clumps': {
            docs: 'Maximum number of distinct hills.',
            arguments: [
              { name: 'N', type: 'number', default: 1 }
            ]
          },
          'set_scale_by_size': {
            docs: 'Automatically scale base size to the map size. Set `number_of_tiles` to the size you want on a 100x100 map (Tiny is 120x120).'
          },
          'set_scale_by_groups': {
            docs: 'Automatically scale number of hills to the map size. Set `number_of_clumps` to the number you want on a 100x100 map (Tiny is 120x120).'
          },
          'spacing': {
            docs: 'Set the spacing on each height level. Larger numbers produce hills with rings of flat areas on each level. This can be used to increase buildable land and prevent long sloped areas.',
            arguments: [
              { name: 'N', type: 'number', default: 1 }
            ]
          }
        }
      }
    }
  },
  'CLIFF_GENERATION': {
    docs: 'Create cliffs - the rocky, non-walkable canyons. You can\'t create single cliffs, but you can define general cliff statistics. All commands have a reasonable default; typing just `<CLIFF_GENERATION>` is enough to create normal cliffs. If you don’t want your map to have cliffs, then don\'t put in a `<CLIFF_GENERATION>` section at all. Cliffs automatically avoid player starting areas and the centers of non-player lands.',
    commands: {
      'min_number_of_cliffs': {
        docs: 'Limit the number of cliffs on the map. Doesn\'t scale with map size, use `if` statements to do it manually.',
        arguments: [
          { name: 'N', type: 'number' }
        ]
      },
      'max_number_of_cliffs': {
        docs: 'Limit the number of cliffs on the map. Doesn\'t scale with map size, use `if` statements to do it manually.',
        arguments: [
          { name: 'N', type: 'number' }
        ]
      },
      'min_length_of_cliff': {
        docs: 'Limit the length of each cliff.',
        arguments: [
          { name: 'N', type: 'number' }
        ]
      },
      'max_length_of_cliff': {
        docs: 'Limit the length of each cliff.',
        arguments: [
          { name: 'N', type: 'number' }
        ]
      },
      'cliff_curliness': {
        docs: 'Chance of turning at each cliff tile. Low values makes straighter cliffs, high values makes curlier cliffs.',
        arguments: [
          { name: 'PERCENT', type: 'percentage' }
        ]
      },
      'min_distance_cliffs': {
        docs: 'Minimum distance between cliffs, in tiles.',
        arguments: [
          { name: 'N', type: 'number', default: 2 }
        ]
      },
      'min_terrain_distance': {
        docs: 'Minimum distance from the nearest body of water (including ice). Does not apply to water created in `<TERRAIN_GENERATION>`.',
        arguments: [
          { name: 'N', type: 'number', default: 2 }
        ]
      }
    }
  },
  'TERRAIN_GENERATION': {
    docs: 'Create more fine-tuned terrain patches on top of what\'s defined in `<LAND_GENERATION>`. The order is important: to place palm forest on desert, create desert first. This section is processed after `<ELEVATION_GENERATION>`, so beware that it\'s possible to place water on hills.',
    commands: {
      'create_terrain': {
        docs: 'Create one or more patches of a terrain.',
        arguments: [
          { name: 'TERRAIN', type: 'terrain' }
        ],
        attributes: {
          'base_terrain': {
            docs: 'What terrain type the new terrain will be placed on.',
            arguments: [
              { name: 'TERRAIN', type: 'terrain', default: 'GRASS' }
            ]
          },
          'land_percent': {
            docs: 'Total size of all terrain patches as a percentage of the map size.',
            arguments: [
              { name: 'PERCENT', type: 'percentage' }
            ],
            conflictsWith: 'number_of_tiles'
          },
          'number_of_tiles': {
            docs: 'Size of terrain as a fixed number of tiles.',
            arguments: [
              { name: 'N', type: 'number' }
            ]
          },
          'number_of_clumps': {
            docs: 'Maximum number of distinct terrain patches.',
            arguments: [
              { name: 'N', type: 'number', default: 1 }
            ]
          },
          'set_scale_by_size': {
            docs: 'Automatically scale terrain size to the map size. Set `number_of_tiles` to the size you want on a 100x100 map (Tiny is 120x120).'
          },
          'set_scale_by_groups': {
            docs: 'Automatically scale number of patches to the map size. Set `number_of_clumps` to the number you want on a 100x100 map (Tiny is 120x120).'
          },
          'spacing_to_other_terrain_types': {
            docs: 'Minimum distance, in tiles, to other types of terrains and cliffs. Useful to keep forests away from water, etc. Order is important: only checks terrains placed before this one.',
            arguments: [
              { name: 'N', type: 'number', default: 0 }
            ]
          },
          'set_avoid_player_start_areas': {
            docs: 'Force terrain to stay away from the center of player lands. Without it, forests and lakes may surround Town Centers.'
          },
          'height_limits': {
            docs: 'Place terrain only on certain elevation levels.',
            arguments: [
              { name: 'MIN', type: 'elevation', default: 0 },
              { name: 'MAX', type: 'elevation', default: 7 }
            ]
          },
          'set_flat_terrain_only': {
            docs: 'Place terrain only on flat terrain of any elevation level. In edge cases this doesn\'t work, use `height_limits 0 0` if you\'re affected by that.'
          },
          'clumping_factor': {
            docs: 'Shape regularity. Value 100 means close to a perfect circle, 0 means weird snaky patches.',
            arguments: [
              { name: 'PERCENT', type: 'percentage', default: 20 }
            ]
          }
        }
      }
    }
  },
  'CONNECTION_GENERATION': {
    docs: 'Connections are lines of terrain that link lands from `<LAND_GENERATION>`. Usually, their job is to ensure that units can walk to other lands. You can\'t create single connections, only general systems of connections.',
    commands: {
      'create_connect_all_lands': {
        docs: 'Connect all defined lands. Doesn\'t include islands created with `<TERRAIN_GENERATION>`.',
        attributes: connectionGenerationAttributes()
      },
      'create_connect_all_players_land': {
        docs: 'Connect all player lands. Connections may pass through non-player lands if that\'s the easiest way.',
        attributes: connectionGenerationAttributes()
      },
      'create_connect_teams_lands': {
        docs: 'Connect all lands of a team with each other. Connections may pass through non-player and enemy lands if that\'s the easiest way.',
        attributes: connectionGenerationAttributes()
      },
      'create_connect_same_land_zones': {
        docs: 'Appears to behave the exact same way as `create_connect_all_lands`.',
        attributes: connectionGenerationAttributes()
      }
    }
  },
  'OBJECTS_GENERATION': {
    docs: 'Create objects like units, buildings, resources, and decorations such as hawks.',
    commands: {
      'create_object': {
        docs: 'Creates one or more objects of a particular type, for each player or for gaia (nature). To avoid crashes and lag, don\'t use `create_object` more than 99 times.',
        arguments: [
          { name: 'OBJECT_TYPE', type: 'entity' }
        ],
        attributes: {
          'number_of_objects': {
            docs: 'How many objects to create.',
            arguments: [
              { name: 'N', type: 'number', default: 1 }
            ]
          },
          'number_of_groups': {
            docs: 'Create multiple groups with `number_of_objects` objects in each. Default is no groups: objects are independent and completely scattered.',
            arguments: [
              { name: 'N', type: 'number' }
            ]
          },
          'group_variance': {
            docs: 'Randomize number of objects in every group. Use with `number_of_groups`. `number_of_objects 5` and `group_variance 2` means groups of 5 ± 2 objects.',
            arguments: [
              { name: 'N', type: 'number' }
            ]
          },
          'set_scaling_to_map_size': {
            docs: 'Automatically scale group number to the map size. Set `number_of_groups` to the size you want on a 100x100 map (Tiny is 120x120). If `number_of_groups` is not set, scales `number_of_objects` instead.',
            conflictsWith: 'set_scaling_to_player_number'
          },
          'set_scaling_to_player_number': {
            docs: 'Automatically multiply `number_of_groups` by the number of players in the game. If `number_of_groups` is not set, multiplies `number_of_objects` instead.'
          },
          'set_place_for_every_player': {
            docs: 'Give specified number of objects to each player. Useful for Town Centers, villagers, etc. Cannot place objects on lands that are separated from player\'s land by water or other terrain where the objects can\'t be placed (shallow, ice, ...). Doesn\'t work with water units, unless player land is on dirt, player is AI, or water is part of the player land. This is madness. See also `set_gaia_object_only`.'
          },
          'set_gaia_object_only': {
            docs: 'Must be used for non-controllable objects when using `set_place_for_every_player`. If used with a controllable object (unit, building), makes it neutral and rescuable like sheep.'
          },
          'terrain_to_place_on': {
            docs: 'Allow objects to be placed only on particular terrain. Cannot be used to force an invalid combination such as relics on water.',
            arguments: [
              { name: 'TERRAIN', type: 'terrain' }
            ]
          },
          'min_distance_to_players': {
            docs: 'Minimum distance, in tiles, from the center of the land that owns the object. If used with `set_place_for_every_player`, sets minimum distance to all players.',
            arguments: [
              { name: 'N', type: 'number' }
            ]
          },
          'max_distance_to_players': {
            docs: 'Maximum distance, in tiles, from the center of the land that owns the object. If used with `set_place_for_every_player`, has no effect.',
            arguments: [
              { name: 'N', type: 'number' }
            ]
          },
          'max_distance_to_other_zones': {
            docs: 'Minimum (not maximum) distance, in tiles, from borders of other zones. Useful to keep objects away from shores. See also commands `create_land` and `create_player_lands` with `zone` attribute.',
            arguments: [
              { name: 'N', type: 'number' }
            ]
          },
          'min_distance_group_placement': {
            docs: 'Minimum distance, in tiles, to all objects of any type created in this command and after it. If used with `number_of_groups`, keeps distance between groups, not objects inside each group. Already existing objects are ignored. See also `temp_min_distance_group_placement`.',
            arguments: [
              { name: 'N', type: 'number' }
            ]
          },
          'temp_min_distance_group_placement': {
            docs: 'Like `min_distance_group_placement` but doesn\'t affect objects created after this command.',
            arguments: [
              { name: 'N', type: 'number' }
            ]
          },
          'group_placement_radius': {
            docs: 'Force objects in every group to stay within the specified distance, in tiles, from the center of the group. Value 3 means a square 7x7 tiles.',
            arguments: [
              { name: 'N', type: 'number', default: 3 }
            ]
          },
          'set_tight_grouping': {
            docs: 'Create objects of the same group touching each other, like gold and stone. Doesn\'t work with objects larger than 1 tile and can\'t overlap, like most buildings. `set_loose_grouping` is the default.',
            conflictsWith: 'set_loose_grouping'
          },
          'set_loose_grouping': {
            docs: 'Create objects of the same group with 1-2 tiles distance from each other. You can omit this because it is the default.'
          },
          'place_on_specific_land_id': {
            docs: 'Place objects only on the land marked by the specified `land_id`. Land must be separated from other lands by water or other terrain where the objects can\'t be placed (shallow, ice, ...). If there are multiple lands with the same id, specified number of objects is placed on each of them.',
            conflictsWith: 'set_place_for_every_player',
            arguments: [
              { name: 'N', type: 'number' }
            ]
          }
        }
      }
    }
  }
}

// These are the same in 4 commands. Let's avoid copy-paste.
function connectionGenerationAttributes (): Attributes {
  return {
    'default_terrain_replacement': {
      docs: 'Creates connections by replacing all intervening terrain with the specified terrain. If used, use before `replace_terrain`.',
      arguments: [
        { name: 'TERRAIN', type: 'terrain' }
      ]
    },
    'replace_terrain': {
      docs: 'Replace base terrain with a connection terrain. Can be used multiple times for multiple replacements.',
      arguments: [
        { name: 'INITIAL_TERRAIN', type: 'terrain' },
        { name: 'REPLACE_TERRAIN', type: 'terrain' }
      ]
    },
    'terrain_cost': {
      docs: 'Set cost of passing through particular terrain type. Connections are more likely to form over terrains with lower cost and avoid terrains with higher cost.',
      arguments: [
        { name: 'TERRAIN', type: 'terrain' },
        { name: 'COST', type: 'number', default: 1 }
      ]
    },
    'terrain_size': {
      docs: 'Set width of connections on particular terrain type. First number is average width in tiles, second number is maximum width variation relative to the average. Values `5 2` create connections of width 5 ± 2. If a connection looks wider than these values, it\'s two parallel ones and you need to set a higher cost (see `terrain_cost`).',
      arguments: [
        { name: 'AVERAGE', type: 'number' },
        { name: 'VARIATION', type: 'number' }
      ]
    }
  }
}

interface Attributes {
  [x: string]: {
    docs?: string,
    conflictsWith?: string,
    arguments?: { name: string, type: 'terrain' | 'number' | 'percentage' | 'entity' | 'elevation', default?: string | number }[]
  }
}
