import FileCookieStore from 'tough-cookie-filestore2'
import Instagram from 'instagram-web-api'
import dotenv from 'dotenv'
import dayjs from 'dayjs'
import fs from 'fs'

dotenv.config()

const username = process.env.IG_USERNAME
const password = process.env.IG_PASSWORD
const cookieStore = new FileCookieStore('/tmp/cookies.json')
const client = new Instagram({ username, password, cookieStore })
const CACHE_PATH = '/tmp/instagram.json'

export async function handler (event, context) {
  if (fs.existsSync(CACHE_PATH) && !event.queryStringParameters.cache && isCached()) {
    const state = JSON.parse(fs.readFileSync(CACHE_PATH))
    console.log('instagram is cached')
    return {
      statusCode: 200,
      contentType: 'json',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify(state.posts),
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

    fs.writeFileSync(CACHE_PATH, JSON.stringify({ date: dayjs().format('YYYY-MM-DD'), posts }))
    console.log('Succesfully fetched instagram')

    return {
      statusCode: 200,
      contentType: 'json',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify(posts)
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
  if (fs.existsSync(CACHE_PATH)) {
    const now = dayjs()
    const cached = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'))
    return cached && cached.date && dayjs(cached.date).add(1, 'day').isAfter(now)
  } else {
    return false
  }
}
