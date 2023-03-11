declare global {
  interface Game {
    code: string
    name: string
    pokedex: string[]
  }

  interface PokedexEntry {
    number: number
    species: number
  }

  interface Pokedex {
    id: number
    code: string
    name: string
    region?: string
    entries: PokedexEntry[]
  }

  interface Pokemon {
    id: number
    code: string
    name: string
    types: TypePokemonRelationship[]
    speciesId: number
    evYield: number[]
  }

  interface PokemonSpecies {
    id: number
    code: string
    name: string
    pokemonIds: number[]
  }

  interface Type {
    id: number
    code: string
    name: string
    damageRelationships: DamageRelationShip[]
  }

  interface TypePokemonRelationship {
    slot: number
    typeId: number
  }

  interface DamageRelationShip {
    factor: number
    typeId: number
  }

  interface ResearchTask {
    name: string
    pokemonIds: number[]
  }

  interface ResearchTaskGroup {
    code: string
    name: string
    researchTasks: ResearchTask[]
  }

  interface Ability {
    id: number
    code: string
    name: string
    flavorText: string
    effect: string
    shortEffect: string
    pokemonIds: number[]
  }

  interface Stat {
    id: number
    code: string
    name: string
  }

  interface AbilityRelationship {
    id: number
    hidden: boolean
  }

  interface StatRelationship {
    id: number
    base: number
    effort: number
  }

  interface PokemonData {
    id: number
    genderRate: number
    captureRate: number
    baseHappiness: number
    legendary: boolean
    mythical: boolean
    abilities: AbilityRelationship[]
    stats: StatRelationship[]
    moves: MoveRelationship[]
  }

  interface Move {
    id: number
    code: string
    name: string
    accuracy: number
    generation_id: number
    power: number
    pp: number
    priority: number
    type_id: number
  }

  interface MoveRelationship {
    generation: number
    level: number
    learn_method_id: number
    move_id: number
  }
}

export {}
