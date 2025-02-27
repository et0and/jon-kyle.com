import Vue from 'vue'
import Vuex from 'vuex'
import * as matter from 'gray-matter'
import * as lib from './lib'
import xtend from 'xtend'

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
    instagram: [ ],
    content: { },
    search: { },
  },
  mutations: {
    setApi (state, payload = { }) {
      state.api = xtend(state.api, payload)
    },
    setUi (state, payload = { }) {
      state.ui = xtend(state.ui, payload)
    },
    setInstagram (state, payload = [ ]) {
      state.instagram = payload
    },
    setOptions (state, payload = { }) {
      state.options = xtend(state.options, payload)
      window.localStorage.setItem('options', JSON.stringify(state.options))
    },
    setPage (state, payload = { }) {
      Object.values(payload).forEach(page => {
        const current = state.content[page.url] || { }
        if (current._loaded) return 
        const data = xtend(current, page, {
          _loaded: current._loaded || page._loaded
        })
        Vue.set(state.content, page.url, data)
      })
    },
    setSearch (state, payload = { }) {
      if (!payload.items) return
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
    fetchOptions ({ commit, state }) {
      const data = window.localStorage.getItem('options')
      commit('setOptions', JSON.parse(data))
    },
    fetchInstagram ({ commit, state }) {
      return fetch(`${state.api.endpoint}/instagram`)
        .then(response => response.json())
        .then(data => commit('setInstagram', data))
        .catch(err => console.warn(err))
    },
    fetchPage ({ commit, state }, url = '') {
      // skip redundant fetches
      if (state.content[url] && state.content[url]._loaded) return
      // hit the api
      return fetch(`${state.api.endpoint}/contentstate?url=${url}&ref=${state.api.branch}`)
        .then(response => response.json())
        .then(data => commit('setPage', data))
        .catch(err => console.warn(err))
    },
    fetchSearch({ commit, state }, query) {
      if (!query) return
      return fetch(`${state.api.endpoint}/search?query=${query}`)
        .then(response => response.json())
        .then(data => commit('setSearch', { query, items: data.items }))
        .catch(err => console.warn(err))
    },
  },
})

const mixin = {
  computed: {
    page() {
      const redirect = {
        '/pct': '/entries/2019-04-19-pct'
      }
      return redirect[this.$route.path]
        ? this.$store.state.content[redirect[this.$route.path]]
        : this.$store.state.content[this.$route.path]
    },
  },
}

export { mixin }
export default store
