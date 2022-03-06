import executeQuery from './query'
import fs from 'fs'

const query = `
  query Abilities {
    abilities: pokemon_v2_ability(where: {is_main_series: {_eq: true}}) {
      id
      name
      names: pokemon_v2_abilitynames(where: {pokemon_v2_language: {name: {_eq: "en"}}}) {
        name
      }
      pokemon: pokemon_v2_pokemonabilities {
        id: pokemon_id
      }
      effect: pokemon_v2_abilityeffecttexts(where: {pokemon_v2_language: {name: {_eq: "en"}}}) {
        short_effect
        effect
      }
      flavor_text: pokemon_v2_abilityflavortexts(where: {pokemon_v2_language: {name: {_eq: "en"}}}) {
        flavor_text
      }
    }
  }
`

export default async function load() {
  const response = await executeQuery(query)

  const abilities = response.data.abilities.map((obj: any): Ability => {
    const result: Ability = {
      id: obj.id,
      code: obj.name,
      name: obj.names[0].name,
      pokemonIds: obj.pokemon.map((_: { id: number }) => _.id),
      effect: '',
      shortEffect: '',
      flavorText: '',
    }

    if (obj.effect.length > 0) {
      result.effect = obj.effect[0].effect
      result.shortEffect = obj.effect[0].short_effect
    }

    if (obj.flavor_text.length > 0) {
      result.flavorText = obj.flavor_text[0].flavor_text
    }

    return result
  })

  fs.writeFileSync('./raw/abilities.json', JSON.stringify(abilities), {
    flag: 'w+',
  })
}
