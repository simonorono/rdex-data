import executeQuery from './query'
import fs from 'fs'

const query = `
  query allMainPokedex {
    pokedex: pokedex(where: {is_main_series: {_eq: true}}) {
      id
      code: name
      name: pokedexnames(where: {language: {name: {_eq: "en"}}}) {
        name
      }
      pokemon: pokemondexnumbers {
        pokedex_number
        pokemon_species_id
      }
      region: region {
        name
      }
    }
  }
`

function getPokedexEntriesQuery(id: number) {
  return `
    query pokedexEntries {
      pokedex: pokedex(where: {id: {_eq: ${id}}}) {
        pokemon: pokemondexnumbers(order_by: {pokedex_number: asc}) {
          pokedex_number
          pokemon_species_id
        }
      }
    }
  `
}

const CUSTOM_NAMES: { [key: string]: string } = {
  blueberry: 'Blueberry',
  kitakami: 'Kitakami',
  'lumiose-city': 'Lumiose',
}

async function loadPokedexEntries(pokedex: Pokedex) {
  const response = await executeQuery(getPokedexEntriesQuery(pokedex.id))

  const entries = response.data.pokedex[0].pokemon.map(
    (pkm: any) =>
      ({
        number: pkm.pokedex_number,
        species: pkm.pokemon_species_id,
      }) as PokedexEntry
  )

  fs.writeFileSync(
    `./raw/pokedex/${pokedex.id}.json`,
    JSON.stringify(entries),
    {
      flag: 'w+',
    }
  )
}

async function loadPokedex(): Promise<Pokedex[]> {
  const response = await executeQuery(query)

  const pokedex: Pokedex[] = response.data.pokedex
    .filter((pkdx: any) => {
      if (Object.keys(CUSTOM_NAMES).includes(pkdx.code)) {
        return true
      }

      return pkdx.name.length > 0
    })
    .map((pkdx: any) => {
      const name =
        CUSTOM_NAMES[pkdx.code] ||
        pkdx.name[0].name.replace(/original|updated/i, '').trim()

      return {
        id: pkdx.id,
        code: pkdx.code,
        name,
        region: pkdx.region?.name,
        entries: pkdx.pokemon.map((entry: any) => [
          entry.pokedex_number,
          entry.pokemon_species_id,
        ]),
      }
    })
    .sort((p1: any, p2: any) => p1.id - p2.id)

  fs.writeFileSync('./raw/pokedex.json', JSON.stringify(pokedex), {
    flag: 'w+',
  })

  return pokedex
}

export default async function () {
  const pokedex = await loadPokedex()

  pokedex.forEach(dex => loadPokedexEntries(dex))
}
