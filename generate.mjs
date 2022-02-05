import fs from 'fs'

import loadAbilities from './generation/abilities.mjs'
import loadPokedex from './generation/pokedex.mjs'
import loadPokemon from './generation/pokemon.mjs'
import loadTypes from './generation/types.mjs'

fs.mkdirSync('./data/raw/pokemon', { recursive: true })

await loadAbilities()
await loadPokedex()
await loadPokemon()
await loadTypes()
