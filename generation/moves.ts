import executeQuery from './query'
import fs from 'fs'

const query = `
  query moves {
    moves: pokemon_v2_move {
      id
      code: name
      accuracy
      generation_id
      power
      pp
      priority
      type_id
      name: pokemon_v2_movenames(where: {pokemon_v2_language: {name: {_eq: "en"}}}) {
        name
      }
    }
  }
`

export default async function load() {
  const response = await executeQuery(query)

  const moves = response.data.moves.map(
    (obj: any): Move => ({
      id: obj.id,
      code: obj.code,
      name: obj.name[0].name,
      accuracy: obj.accuracy,
      generation_id: obj.generation_id,
      power: obj.power,
      pp: obj.pp,
      priority: obj.priority,
      type_id: obj.type_id,
    })
  )

  fs.writeFileSync('./raw/moves.json', JSON.stringify(moves), {
    flag: 'w+',
  })
}
