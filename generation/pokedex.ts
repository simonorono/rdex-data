import executeQuery from './query'
import fs from 'fs'

const query = `
  query allMainPokedex {
    pokedex: pokemon_v2_pokedex(where: {is_main_series: {_eq: true}}) {
      id
      code: name
      name: pokemon_v2_pokedexnames(where: {pokemon_v2_language: {name: {_eq: "en"}}}) {
        name
      }
      pokemon: pokemon_v2_pokemondexnumbers {
        pokedex_number
        pokemon_species_id
      }
      region: pokemon_v2_region {
        name
      }
    }
  }
`

export default async function load() {
  const response = await executeQuery(query)

  const pokedex = response.data.pokedex
    .map((pkdx: any) => ({
      id: pkdx.id,
      code: pkdx.code,
      name: pkdx.name[0].name.replace(/original|updated/i, '').trim(),
      entries: pkdx.pokemon
        .map((entry: any) => [entry.pokedex_number, entry.pokemon_species_id])
        .sort((e1: any, e2: any) => e1[0] - e2[0]),
      region: pkdx.region?.name,
    }))
    .sort((p1: any, p2: any) => p1.id - p2.id)

  pokedex.forEach((pokedex: any) => {
    pokedex.entries.sort((pe1: any, pe2: any) => pe1.number - pe2.number)
  })

  fs.writeFileSync('./raw/pokedex.json', JSON.stringify(pokedex), {
    flag: 'w+',
  })
}
