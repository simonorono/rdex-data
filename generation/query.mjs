import http from 'http'

export default async function executeQuery(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query })

    const options = {
      hostname: 'localhost',
      method: 'POST',
      path: '/v1/graphql',
      port: 8080,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    }

    const req = http.request(options, result => {
      result.setEncoding('utf8')

      let body = ''

      result.on('data', data => {
        body += data
      })

      result.on('end', () => resolve(JSON.parse(body)))
    })

    req.on('error', error => {
      reject(error)
    })

    req.write(data)
    req.end()
  })
}
