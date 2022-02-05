import executeQuery from "./query.mjs"
import fs from "fs"

const query = `
query EvolutionChains {
  species: pokemon_v2_pokemonspecies {
    id
    chain: pokemon_v2_evolutionchain {
      species: pokemon_v2_pokemonspecies {
        id
        from: evolves_from_species_id
        trigger: pokemon_v2_pokemonevolutions {
          min_level
          needs_overworld_rain
          min_happiness
          min_affection
          min_beauty
          location_id
          known_move_type_id
          known_move_id
          held_item_id
          gender_id
          evolved_species_id
          evolution_trigger_id
          evolution_item_id
          trigger: pokemon_v2_evolutiontrigger {
            name
          }
        }
      }
    }
  }
}
`

export default async function load() {
  const chainsResponse = await executeQuery(query)

  const chains = chainsResponse.data.species.map(species => ({
    id: species.id,

  }))

  fs.writeFileSync('./data/raw/evolution-chains.json', JSON.stringify(chains), { flag: 'w+' })
}
