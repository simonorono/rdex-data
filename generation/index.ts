import generateAbilities from './abilities'
import generatePokedex from './pokedex'
import generatePokemon from './pokemon'
import generateTypes from './types'
;(async () => {
  await generateAbilities()
  await generatePokedex()
  await generatePokemon()
  await generateTypes()
})()
