import Vue from 'vue'
import Router from 'vue-router'

import Search from './views/Search'
import Entry from './views/Entry'
import Index from './views/Index'
import About from './views/About'
import Home from './views/Home'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
    },
    {
      path: '/entries',
      name: 'entries',
      component: Home,
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
    },
    {
      path: '/entries/:entry',
      name: 'entry',
      component: Entry,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    }
  ],
})
