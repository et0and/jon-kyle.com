import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()

const CLIENT_SECRET = process.env.CLIENT_SECRET
const CLIENT_ID = process.env.CLIENT_ID

export function handler(event, context, callback) {
  const query = event.queryStringParameters.query

  if (!query) {
    console.log('No search query')
    return callback(null, {
      statusCode: 200,
      contentType: 'json',
      body: JSON.stringify({ total_count: 0, items: [] }),
    })
  }

  console.log('Fetching search entries')
  fetch(`https://api.github.com/search/code?q=${query}+repo:jondashkyle/archive`, {
    headers: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    },
  }).then(response => response.json())
    .then((data) => {
      console.log('Succesfully fetched search entries')
      callback(null, {
        statusCode: 200,
        contentType: 'json',
        body: JSON.stringify(data),
      })
    })
    .catch((err) => {
      console.log('Error fetching search entries')
      callback(null, {
        statusCode: 401,
        contentType: 'json',
        body: JSON.stringify({ msg: 'No luck' }),
      })
    })
}
