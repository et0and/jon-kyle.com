import * as matter from 'gray-matter'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import dayjs from 'dayjs'
import path from 'path'

// configuration
dotenv.config()

// auth
const CLIENT_RAW = 'https://raw.githubusercontent.com/' + process.env.CLIENT_REPO + '/'
const CLIENT_API = 'https://api.github.com/repos/' + process.env.CLIENT_REPO + '/contents/'
const CLIENT_SECRET = process.env.CLIENT_SECRET
const CLIENT_ID = process.env.CLIENT_ID

// defaults
const subset = ['title', 'date', 'description', 'tags']
const branches = ['master', 'drafts']
const timeout = 5

// cache
let caching = false
const updated = { }
const state = { }

/**
 * Lambda Handler
 */
export function handler (event, context, callback) {
  const params = Object.assign({
    full: false,
    ref: 'master',
    amount: 1,
    page: 1,
    url: '/' 
  }, event.queryStringParameters)

  // populate state
  if (!caching) {
    branches.forEach(branch => initializeState('/', branch))
    caching = true
  }

  // grab the directory
  getPage(params.url, params.ref, true, params.full)
    .then(data => onSuccess(data))
    .catch(err => onError(err))

  function onSuccess (data) {
    callback(null, {
      statusCode: 200,
      contentType: 'json',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify(data)
    })
  }

  function onError (err) {
    callback(null, {
      statusCode: 200,
      contentType: 'json',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ message: 'Not found' })
    })
  }
}

/**
 * Initialize State
 */
function initializeState (url, ref) {
  fetchDirectory(url, ref)
    .then(onSuccess)
    .catch(onError)

  function onSuccess (resp) {
    resp.pages.forEach(url => fetchDirectory(url, ref))
  }

  function onError (err) {
    return console.warn(err)
  }
}

/**
 * Get Page
 */
async function getPage (url = '/', ref = 'master', recursive = true, isFull = false) {
  try {
    // file
    if (path.extname(url) === '.md') {
      const page = await fetchFile(url, ref)
      return { [page.url]: page }
    // directory
    } else {
      const page = await fetchDirectory(url, ref)
      if (recursive && isFull) {
        const pages = await Promise
          .all(page._deps.map(url => getPage(url, ref, false)))
          .then(data => data.reduce((res, cur) =>  Object.assign(res, cur), { }))
        return Object.assign({ [page.url]: page }, pages)
      } else {
        return { [page.url]: page }
      }
    }
  } catch (err){ 
    return { message: err.message }
  }
}

/**
 * Fetch File
 */
async function fetchFile (url = '/readme.md', ref = 'master') {
  // return cached if valid
  if (isPageCached(url, ref)) return state[ref][url]

  const name = path.basename(url)
  const _url = path.join(path.dirname(url), path.basename(name, path.extname(name)))
  const page = { url: _url }

  return fetch(formatFileUrl(url, ref))
    .then(data => data.text())
    .then(data => Object.assign(parseContent(data), page))
}

/**
 * Fetch Directory
 */
function fetchDirectory (url = '/', ref = 'master') {
  // return cached if valid
  if (isPageCached(url, ref)) return state[ref][url]

  // fetch otherwise
  return fetch(formatRequestUrl(url, ref))
    .then(data => data.json())
    .then(data => parsePageData(data, url))
    .then(page => fetchPageContent(page, ref))
    .then(page => cachePage(page, ref))
}

/**
 * Format Request URL
 */
function formatRequestUrl (url, ref) {
  return CLIENT_API + url + '?ref=' + ref + '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
}

/**
 * Format File URL
 */
function formatFileUrl (url, ref) {
  return CLIENT_RAW + ref + url
}

/**
 * Parse Page Data
 */
function parsePageData (data, url) {
  return data
    .filter(file => (file.name.substring(0, 1) !== '.'))
    .reduce((res, cur, i, arr) => {
      const extname = path.extname(cur.name)
      // directory
      if (!extname) {
        res.pages.push(path.join(url, cur.name))
        res._deps.push(path.join(url, cur.name))
      // markdown
      } else if (extname === '.md') {
        // skip readme.md
        if (cur.name !== 'readme.md') {
          res.pages.push(path.join(url, path.basename(cur.name, path.extname(cur.name))))
          res._deps.push(path.join(url, cur.name))
        } else {
          res._src = cur.name
        }
      // file
      } else {
        res.files.push(cur.name)
      }
      return res
    }, {
      _deps: [ ],
      pages: [ ],
      files: [ ],
      url: url
    })
}

/**
 * Fetch Page Content
 */
function fetchPageContent (page, ref) {
  return new Promise((resolve, reject) => {
    if (page._src) {
      return fetch(formatFileUrl(page.url + '/' + page._src, ref))
        .then(data => data.text())
        .then(data => resolve(Object.assign(parseContent(data), page)))
        .catch(err => resolve(page))
    } else {
      return resolve(page)
    }
  })
}

/**
 * Parse Content
 */
function parseContent (_data) {
  let { data, content } = matter(_data)

  // clean up
  content = content.trim()

  // title
  if (content && content.substring(0, 2) === '# ') {
    data.title = content.substring(2, content.indexOf('\n'))
  }

  // content
  if (data.title) {
    content = content.substring(content.indexOf('\n'), content.length).trim()
  }

  return { ...data, content }
}

/**
 * Cache Page
 */
function cachePage (page, ref) {
  const now = dayjs()
  if (!state[ref]) state[ref] = { }
  if (!state[ref][page.url]) state[ref][page.url] = { }
  if (!updated[ref]) updated[ref] = { }
  Object.assign(state[ref][page.url], page)
  updated[ref][page.url] = now
  return page
}

/**
 * Is Page Cached
 */
function isPageCached (url, ref) {
  const now = dayjs()
  const hasUpdated = updated[ref] && updated[ref][url]
  const hasState = state[ref] && state[ref][url]
  const isFresh = () => dayjs(updated[ref][url]).add(timeout, 'minutes').isBefore(now)
  return (hasUpdated && hasState && isFresh())
}


/**
 *  Get Page Meta
 */
function getMetaFromUrl (url) {
    const name = url.replace(/.md/g, '')
    const date = name.substring(0, 10)
    return { name, date }
}
