import dotenv from 'dotenv'
import fetch from 'node-fetch'
import dayjs from 'dayjs'
dotenv.config()

const CLIENT_SECRET = process.env.CLIENT_SECRET
const CLIENT_ID = process.env.CLIENT_ID

const updated = {
  master: dayjs(),
  drafts: dayjs()
}

const cache = {
  master: [ ],
  drafts: [ ]
}

const state = {

}

export function handler (event, context, callback) {
  const { url } = event.queryStringParameters
  return fetchEntries(event, context, callback)
}

function fetchEntries (event, context, callback) {
  const now = dayjs()
  const ref = event.queryStringParameters.ref || 'master'

  if (cache[ref].length && dayjs(updated[ref]).add(5, 'minutes').isAfter(now)) {
    console.log('Cached entries')
    callback(null, {
      statusCode: 200,
      contentType: 'json',
      body: JSON.stringify(cache[ref])
    })
  } else {
    console.log('Fetching new entries')
    fetch(`https://api.github.com/repos/jondashkyle/archive/contents/entries?ref=${ref}`, {
      headers: {
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET
      }
    }).then(response => response.json())
      .then(data => {
        console.log('Succesfully fetched new entries')
        updated[ref] = now
        cache[ref] = data
        callback(null, {
          statusCode: 200,
          contentType: 'json',
          body: JSON.stringify(cache[ref])
        })
      })
      .catch(err => {
        console.log('Error fetching new entries')
        callback(null, {
          statusCode: 401,
          contentType: 'json',
          body: JSON.stringify({ msg: 'No luck' })
        })
      })
  }
}
