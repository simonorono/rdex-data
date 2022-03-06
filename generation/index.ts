import generatePokedex from './pokedex'
import generatePokemon from './pokemon'
import generateTypes from './types'
;(async () => {
  await generatePokedex()
  await generatePokemon()
  await generateTypes()
})()
