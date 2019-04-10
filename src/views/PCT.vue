<template>
  <div v-if="entries">
    <FeedWalk :page="page" :entries="entries" />
    <div class="footer">
      <div>
        <router-link v-if="next" :to="next.url">
          <div class="heading">Newer</div>
          <div class="title">
            <span class="underline">{{next.dateFormatted}}</span>
            <span v-if="next.title"> — {{next.title}}</span>
          </div>
         </router-link>
      </div>
      <div>
        <router-link v-if="prev" :to="prev.url">
          <div class="heading">Older</div>
          <div class="title">
            <span class="underline">{{prev.dateFormatted}}</span>
            <span v-if="prev.title">— {{prev.title}}</span>
          </div>
         </router-link>
      </div>
    </div>
  </div>
  <LoadingIndicator v-else />
</template>

<script>
import LoadingIndicator from '@/components/LoadingIndicator'
import FeedWalk from '../components/FeedWalk'
import { mixin } from '../store'

export default {
  name: 'PCT',
  components: { FeedWalk, LoadingIndicator },
  mixins: [ mixin ],
  mounted () {
    const parentUrl = this.$route.path.substring(0, this.$route.path.lastIndexOf('/'))
    this.$store.dispatch('fetchPage', parentUrl)
  },
  computed: {
    page () {
      return this.$store.state.content['/entries/2019-04-19-pct']
    },
    entries () {
      const page = this.$store.state.content['/entries/2019-04-19-pct']
      if (!page) return
      return page.pages
        .map(url => this.$store.state.content[url])
        .filter(page => page)
        .filter(page => page.visible !== false)
    },
    parentUrl () {
      if (!this.page) return
      return this.page.url.substring(0, this.page.url.lastIndexOf('/'))
    },
    parent() {
      const parent = this.$store.state.content[this.parentUrl]
      return parent
    },
    pages () {
      if (!this.page || !this.parent) return [ ]
      const output = this.parent.pages
        .map(page => this.$store.state.content[page])
        .filter(page => page.visible !== false)
        .sort((b, a) => (b.date.replace(/-/g, '') - a.date.replace(/-/g, '')))
        .map(page => page.url)
      return output
    },
    prev() {
      if (!this.page) return
      const index = this.pages.indexOf(this.page.url)
      return this.$store.state.content[this.pages[index - 1]]
    },
    next() {
      if (!this.page) return
      const index = this.pages.indexOf(this.page.url)
      return this.$store.state.content[this.pages[index + 1]]
    }
  }
}
</script>

<style scoped>
.footer {
  display: flex;
  margin-top: 3rem;
}

.footer > div {
  flex: 1;
  padding: 1rem;
}

.footer .title {
  text-indent: -1rem;
  padding-left: 1rem;
}

.footer a { text-decoration: none; display: block; }
.footer a .underline { text-decoration: underline }

.footer .heading {
  color: rgba(var(--fg), 0.25)
}

@media (max-width: 800px) {
  .footer {
    display: block;
  }
}
</style>