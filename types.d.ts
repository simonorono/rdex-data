declare interface Game {
  code: string
  name: string
  pokedex: string[]
}

declare interface PokedexEntry {
  number: number
  species: number
}

declare interface Pokedex {
  id: number
  code: string
  name: string
  region: string

  pokemonEntries: PokedexEntry[]
}

declare interface Pokemon {
  id: number
  code: string
  name: string
  types: TypePokemonRelationship[]
  speciesId: number
}

declare interface PokemonSpecies {
  id: number
  code: string
  name: string
  pokemonIds: number[]
}

declare interface Type {
  id: number
  code: string
  name: string
  damageRelationships: DamageRelationShip[]
}

declare interface TypePokemonRelationship {
  slot: number
  typeId: number
}

declare interface DamageRelationShip {
  factor: number
  typeId: number
}

declare interface ResearchTask {
  name: string
  pokemonIds: number[]
}

declare interface ResearchTaskGroup {
  code: string
  name: string
  researchTasks: ResearchTask[]
}

declare interface Ability {
  id: number
  code: string
  name: string
  flavorText: string
  effect: string
  shortEffect: string
  pokemonIds: number[]
}

declare interface Stat {
  id: number
  code: string
  name: string
}

declare interface AbilityRelationship {
  id: number
  hidden: boolean
}

declare interface StatRelationship {
  id: number
  base: number
  effort: number
}

declare interface PokemonData {
  id: number
  genderRate: number
  captureRate: number
  baseHappiness: number
  legendary: boolean
  mythical: boolean
  abilities: AbilityRelationship[]
  stats: StatRelationship[]
}
