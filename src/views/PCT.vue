<template>
  <div v-if="entries">
    <FeedWalk :page="page" :entries="entries" />
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
    this.$store.dispatch('fetchPage', '/entries/2019-04-19-pct')
  },
  computed: {
    entries () {
      const page = this.$store.state.content['/entries/2019-04-19-pct']
      if (!page) return
      return page.pages
        .map(url => this.$store.state.content[url])
        .filter(page => page)
        .filter(page => page.visible !== false)
    },
    page () {
      return this.$store.state.content['/entries/2019-04-19-pct']
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