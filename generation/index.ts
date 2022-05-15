import generateAbilities from './abilities'
import generateMoves from './moves'
import generatePokedex from './pokedex'
import generatePokemon from './pokemon'
import generateTypes from './types'

;(async () => {
  await generateAbilities()
  await generateMoves()
  await generatePokedex()
  await generatePokemon()
  await generateTypes()
})()
