import Vue from 'vue'
import Vuex from 'vuex'
import * as matter from 'gray-matter'
import * as lib from './lib'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    api: {
      location: 'https://raw.githubusercontent.com/jondashkyle/archive/',
      branch: process.env.VUE_APP_BRANCH || 'master',
      endpoint: '/.netlify/functions',
    },
    ui: {
      range: 4,
    },
    options: {
      night: false,
      subscribed: false,
    },
    content: { },
    search: { },
  },
  mutations: {
    setApi(state, payload = { }) {
      state.api = Object.assign({ }, state.api, payload)
    },
    setUi(state, payload = { }) {
      state.ui = Object.assign({ }, state.ui, payload)
    },
    setOptions(state, payload = { }) {
      state.options = Object.assign({ }, state.options, payload)
      window.localStorage.setItem('options', JSON.stringify(state.options))
    },
    setEntry(state, payload = { }) {
      const data = matter(payload.data)
      const url = payload.url || '/'
      Vue.set(state.content, url, {
        ...state.content[url],
        ...data.data,
        content: data.content.trim(),
        _loaded: true,
      })
    },
    setEntries(state, payload = []) {
      Vue.set(state.content, '/entries', { pages: [] })
      payload.forEach((entry) => {
        const meta = lib.getEntryMeta(entry)
        state.content['/entries'].pages.push(meta.url)
        Vue.set(state.content, meta.url, meta)
      })
    },
    setSearch(state, payload = { }) {
      const entries = payload.items
        .map((entry, i, arr, src) => {
          const parts = entry.path.split('/')
          if (parts[0] !== 'entries') return false
          const meta = lib.getEntryMeta({
            name: entry.path.replace('entries/', ''),
            path: [parts[0], parts[1]].join('/'),
          })
          return meta.url
        })
        .filter(key => key)
        .filter((elem, index, self) => (index === self.indexOf(elem)))
      Vue.set(state.search, payload.query, entries)
    },
  },
  actions: {
    fetchOptions({ commit, state }) {
      const data = window.localStorage.getItem('options')
      commit('setOptions', JSON.parse(data))
    },
    fetchEntry({ commit, state }, url = '') {
      const path = url.replace('/readme', '').replace('.md', '')
      if (!url) return
      fetch(state.api.location + state.api.branch + url)
        .then(response => response.text())
        .then(data => commit('setEntry', { url: path, data }))
        .catch(err => console.warn(err))
    },
    fetchEntries({ commit, state }) {
      fetch(`${state.api.endpoint}/state?ref=${state.api.branch}`)
        .then(response => response.json())
        .then(data => commit('setEntries', data))
        .catch(err => console.warn(err))
    },
    fetchSearch({ commit, state }, query) {
      if (!query) return
      fetch(`${state.api.endpoint}/search?query=${query}`)
        .then(response => response.json())
        .then(data => commit('setSearch', { query, items: data.items }))
        .catch(err => console.warn(err))
    },
  },
})

const mixin = {
  computed: {
    page() {
      return this.$store.state.content[this.$route.path]
    },
  },
}

export { mixin }
export default store
