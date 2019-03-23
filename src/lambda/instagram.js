import FileCookieStore from 'tough-cookie-filestore2'
import Instagram from 'instagram-web-api'
import dotenv from 'dotenv'
import dayjs from 'dayjs'
dotenv.config()

const username = process.env.IG_USERNAME
const password = process.env.IG_PASSWORD
const cookieStore = new FileCookieStore('/tmp/cookies.json')
const client = new Instagram({ username, password, cookieStore })

let state = { }
let cached

export async function handler (event, context) {
  if (!event.queryStringParameters.cache && isCached()) {
    console.log('instagram is cached')
    return {
      statusCode: 200,
      contentType: 'json',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify(state),
    }
  }

  try {
    await client.login()
    const user = await client.getUserByUsername({ username: 'jondashkyle' })
    const data = user['edge_owner_to_timeline_media'].edges
    const posts = data.map(edge => ({
      id: edge.node.id,
      url: edge.node.display_url,
      shortcode: edge.node.shortcode,
      caption: edge.node.accessibility_caption
    }))

    console.log('Succesfully fetched instagram')
    cached = dayjs()
    state = posts

    return {
      statusCode: 200,
      contentType: 'json',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify(state)
    }
  } catch (err) {
    return {
      statusCode: 401,
      contentType: 'json',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ msg: err.message }),
    }
  }
}

/**
 * Is Cached
 */
function isCached () {
  const now = dayjs()
  return cached && dayjs(cached).add(1, 'day').isAfter(now)
}
