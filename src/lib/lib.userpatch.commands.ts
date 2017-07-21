import { CommandDefinitions } from './'

export const definitions: CommandDefinitions = {
  'PLAYER_SETUP': {
    commands: {
      'grouped_by_team': {
        docs: 'Place team members close to each other on the map. `base_size` attribute of `create_player_lands` command determines the distance between players in a team.',
        conflictsWith: 'random_placement'
      },
      'nomad_resources': {
        docs: 'Adds the cost of a Town Center (275 wood, 100 stone) to starting resources as on nomad maps. Can be used even if your map is not a nomad map.'
      }
    }
  },
  'LAND_GENERATION': {
    commands: {
      'create_player_lands': {
        attributes: {
          'base_elevation': {
            docs: 'Modify the base elevation for player and standard lands. `<ELEVATION_GENERATION>` section must exist if this attribute is used.',
            arguments: [
              { name: 'N', type: 'elevation', default: 1 }
            ]
          }
        }
      }
    }
  },
  'ELEVATION_GENERATION': {},
  'CLIFF_GENERATION': {},
  'TERRAIN_GENERATION': {},
  'CONNECTION_GENERATION': {},
  'OBJECTS_GENERATION': {
    commands: {
      'create_object': {
        attributes: {
          'resource_delta': {
            docs: 'Modify the resources of the object. Useful to create gold mines with only 300 gold, and so on.',
            arguments: [
              { name: 'DIFFERENCE', type: 'number', default: 0 }
            ]
          }
        }
      }
    }
  }
}
