import executeQuery from "./query.mjs"
import fs from "fs"

const speciesQuery = `
  query pokemonSpecies {
    species: pokemon_v2_pokemonspecies {
      id
      code: name
      order
      pokemons: pokemon_v2_pokemons {
        id,
        code: name,
        species: pokemon_v2_pokemonspecy {
          id
        }
      }
      species_name: pokemon_v2_pokemonspeciesnames(where: {pokemon_v2_language: {name: {_eq: "en"}}}) {
        name
      }
    }
  }
`

const pokemonQuery = `
  query pokemons {
    pokemon: pokemon_v2_pokemon {
      id
      code: name
      types: pokemon_v2_pokemontypes {
        slot
        type: pokemon_v2_type {
          id
        }
      }
      species: pokemon_v2_pokemonspecy {
        id
      }
    }
  }
`

function getPokemonDataQuery(id) {
  return `
    query PokemonData {
      pokemon: pokemon_v2_pokemon(where: {id: {_eq: ${id}}}) {
        id
        code: name
        abilities: pokemon_v2_pokemonabilities {
          is_hidden
          ability: pokemon_v2_ability {
            id
          }
        }
        stats: pokemon_v2_pokemonstats {
          base_stat
          effort
          stat_id
        }
        species: pokemon_v2_pokemonspecy {
          gender_rate
          capture_rate
          base_happiness
          is_legendary
          is_mythical
        }
      }
    }
  `
}

function filterPokemon(pokemon) {
  return pokemon.filter(pkm => {
    if (pkm.code.includes('totem')) {
      return false
    }

    switch (pkm.species.id) {
      case 25: // pikachu
        return ['pikachu', 'pikachu-gmax'].includes(pkm.code)

      case 718: // zygarde
        return ['zygarde', 'zygarde-10', 'zygarde-complete'].includes(pkm.code)

      default:
        return true
    }
  })
}

async function loadSpecies() {
  const speciesResponse = await executeQuery(speciesQuery)

  const species = speciesResponse.data.species.map(spcy => ({
    id: spcy.id,
    code: spcy.code,
    name: spcy.species_name[0].name,
    pokemonIds: filterPokemon(spcy.pokemons).map(pkm => pkm.id).sort((a, b) => a - b)
  })).sort((a, b) => a.id - b.id)

  fs.writeFileSync('./data/raw/species.json', JSON.stringify(species), { flag: 'w+' })
}

async function loadPokemon() {
  const pokemonResponse = await executeQuery(pokemonQuery)

  const pokemons = filterPokemon(pokemonResponse.data.pokemon).map(pkm => ({
    id: pkm.id,
    code: pkm.code,
    types: pkm.types.map(type => ([type.slot, type.type.id])),
    speciesId: pkm.species.id,
  })).sort((a, b) => a.id - b.id)

  fs.writeFileSync('./data/raw/pokemon.json', JSON.stringify(pokemons), { flag: 'w+' })

  return pokemons
}

async function loadPokemonData(pkm) {
  const query = getPokemonDataQuery(pkm.id)

  const response = await executeQuery(query)

  const obj = response.data.pokemon[0]

  const pokemon = {
    id: obj.id,
    genderRate: obj.species.gender_rate,
    captureRate: obj.species.capture_rate,
    baseHappiness: obj.species.base_happiness,
    legendary: obj.species.is_legendary,
    mythical: obj.species.is_mythical,

    abilities: obj.abilities.map(ability => ({
      hidden: ability.is_hidden,
      id: ability.ability.id
    })).sort((a1, a2) => a1.id - a2.id),

    stats: obj.stats.map(stat => ({
      id: stat.stat_id,
      base: stat.base_stat,
      effort: stat.effort,
    })).sort((s1, s2) => s1.id - s2.id)
  }

  fs.writeFileSync(`./data/raw/pokemon/${pkm.id}.json`, JSON.stringify(pokemon), { flag: 'w+' })
}

export default async function load() {
  await loadSpecies()

  const pokemons = await loadPokemon()

  pokemons.forEach(loadPokemonData)
}
