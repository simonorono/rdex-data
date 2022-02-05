import executeQuery from "./query.mjs"
import fs from "fs"

const query = `
  query allTypes {
    types: pokemon_v2_type {
      id
      code: name
      damage: pokemon_v2_typeefficacies {
        factor: damage_factor
        target: pokemonV2TypeByTargetTypeId {
          id
        }
      }
      name: pokemon_v2_typenames(where: {pokemon_v2_language: {name: {_eq: "en"}}}) {
        name
      }
    }
  }
`

export default async function load() {
  const typeResponse = await executeQuery(query)

  const types = typeResponse.data.types.map(type => ({
    id: type.id,
    code: type.code,
    name: type.name[0].name,
    damageRelationships: type.damage.map(dr => ({
      typeId: dr.target.id,
      factor: dr.factor / 100
    }))
  })).filter(type => !['shadow', 'unknown'].includes(type.code)).sort((a, b) => a.id - b.id)

  fs.writeFileSync('./data/raw/types.json', JSON.stringify(types), { flag: 'w+' })
}
