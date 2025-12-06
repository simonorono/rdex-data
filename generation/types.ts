import executeQuery from './query'
import fs from 'fs'

const query = `
  query allTypes {
    types: type {
      id
      code: name
      damage: typeefficacies {
        factor: damage_factor
        target: TypeByTargetTypeId {
          id
        }
      }
      name: typenames(where: {language: {name: {_eq: "en"}}}) {
        name
      }
    }
  }
`

export default async function load() {
  const typeResponse = await executeQuery(query)

  const types = typeResponse.data.types
    .map(
      (type: any) =>
        ({
          id: type.id,
          code: type.code,
          name: type.name[0].name,
          damageRelationships: type.damage.map(
            (dr: any) =>
              ({
                typeId: dr.target.id,
                factor: dr.factor / 100,
              }) as DamageRelationShip
          ),
        }) as Type
    )
    .filter(
      (type: Type) => !['shadow', 'stellar', 'unknown'].includes(type.code)
    )
    .sort((a: Type, b: Type) => a.id - b.id)

  fs.writeFileSync('./raw/types.json', JSON.stringify(types), { flag: 'w+' })
}
