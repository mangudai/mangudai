import { Mangudai } from '../src/index'

describe('Mangudai', () => {
  it('works', () => {
    const mangudai = new Mangudai()
    const script = mangudai
      .addCommand('PLAYER_SETUP', 'random_placement')
      .addCommand('PLAYER_SETUP', 'nomad_resources')
      .addCommand('LAND_GENERATION', 'base_terrain', 'GRASS')
      .toString()

    script.should.equal(`<PLAYER_SETUP>
random_placement
nomad_resources

<LAND_GENERATION>
base_terrain GRASS
`)
  })
})
