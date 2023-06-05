import executeQuery from './query'
import fs from 'fs'

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
      ev_yield: pokemon_v2_pokemonstats(where: {effort: {_gt: 0}}) {
        stat_id
      }
    }
  }
`

function getPokemonDataQuery(id: number): string {
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
        moves: pokemon_v2_pokemonmoves {
          generation: pokemon_v2_versiongroup {
            generation_id
          }
          learn_method: move_learn_method_id
          level
          move_id
        }
      }
    }
  `
}

function filterPokemon(pokemon: any[]) {
  return pokemon.filter(pkm => {
    if (pkm.code.includes('totem')) {
      return false
    }

    switch (pkm.species.id) {
      case 25: // pikachu
        return ['pikachu', 'pikachu-gmax'].includes(pkm.code)

      case 133: // eevee
        return ['eevee', 'eevee-gmax'].includes(pkm.code)

      case 658: // greninja
        return ['greninja', 'greninja-ash'].includes(pkm.code)

      case 670: // floette
        return ['floette'].includes(pkm.code)

      case 718: // zygarde
        return ['zygarde', 'zygarde-10', 'zygarde-complete'].includes(pkm.code)

      case 774: // minior
        return ['minior-red-meteor', 'minior-red'].includes(pkm.code)

      case 845: // cramorant
        return ['cramorant'].includes(pkm.code)

      case 1007: // Koraidon
        return ['koraidon'].includes(pkm.code)

      case 1008: // Miraidon
        return ['miraidon'].includes(pkm.code)

      default:
        return true
    }
  })
}

async function loadSpecies() {
  const speciesResponse = await executeQuery(speciesQuery)

  const species = speciesResponse.data.species
    .map(
      (spcy: any) =>
        ({
          id: spcy.id,
          code: spcy.code,
          name: spcy.species_name[0].name,
          pokemonIds: filterPokemon(spcy.pokemons)
            .map(pkm => pkm.id)
            .sort((a, b) => a - b),
        } as PokemonSpecies)
    )
    .sort((a: PokemonSpecies, b: PokemonSpecies) => a.id - b.id)

  fs.writeFileSync('./raw/species.json', JSON.stringify(species), {
    flag: 'w+',
  })
}

async function loadPokemon() {
  const pokemonResponse = await executeQuery(pokemonQuery)

  const pokemons = filterPokemon(pokemonResponse.data.pokemon)
    .map(
      (pkm: any): Pokemon =>
        ({
          id: pkm.id,
          code: pkm.code,
          types: pkm.types.map((type: any) => [type.slot, type.type.id]),
          speciesId: pkm.species.id,
          evYield: pkm.ev_yield.map((stat: any) => stat.stat_id),
        } as Pokemon)
    )
    .sort((a, b) => a.id - b.id)

  fs.writeFileSync('./raw/pokemon.json', JSON.stringify(pokemons), {
    flag: 'w+',
  })

  return pokemons
}

async function loadPokemonData(pkm: any) {
  const query = getPokemonDataQuery(pkm.id)

  const response = await executeQuery(query)

  const obj = response.data.pokemon[0]

  const pokemon: PokemonData = {
    id: obj.id,
    genderRate: obj.species.gender_rate,
    captureRate: obj.species.capture_rate,
    baseHappiness: obj.species.base_happiness,
    legendary: obj.species.is_legendary,
    mythical: obj.species.is_mythical,

    abilities: obj.abilities
      .map(
        (ability: any): AbilityRelationship => ({
          hidden: ability.is_hidden,
          id: ability.ability.id,
        })
      )
      .sort(
        (a1: AbilityRelationship, a2: AbilityRelationship) => a1.id - a2.id
      ),

    stats: obj.stats
      .map(
        (stat: any): StatRelationship => ({
          id: stat.stat_id,
          base: stat.base_stat,
          effort: stat.effort,
        })
      )
      .sort((s1: StatRelationship, s2: StatRelationship) => s1.id - s2.id),

    moves: [],
  }

  obj.moves.forEach((mv: any) => {
    const existing = pokemon.moves.find(
      el =>
        mv.generation.generation_id == el.generation &&
        el.learn_method_id == mv.learn_method &&
        el.level == mv.level &&
        el.move_id == mv.move_id
    )

    if (existing) {
      return
    }

    pokemon.moves.push({
      generation: mv.generation.generation_id,
      learn_method_id: mv.learn_method,
      level: mv.level,
      move_id: mv.move_id,
    })
  })

  fs.writeFileSync(`./raw/pokemon/${pkm.id}.json`, JSON.stringify(pokemon), {
    flag: 'w+',
  })
}

export default async function load() {
  await loadSpecies()

  const pokemons = await loadPokemon()

  for(let pkm of pokemons) {
    await loadPokemonData(pkm)
  }
}
