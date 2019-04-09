<template>
  <FeedWalk :page="page" :entries="entries" v-if="entries" />
  <LoadingIndicator v-else />
</template>

<script>
import LoadingIndicator from '@/components/LoadingIndicator'
import FeedWalk from '../components/FeedWalk'

export default {
  name: 'PCT',
  components: { FeedWalk, LoadingIndicator },
  mounted () {
    this.$store.dispatch('fetchPage', '/projects/pct')
  },
  computed: {
    page () {
      return this.$store.state.content['/projects/pct']
    },
    entries () {
      const page = this.$store.state.content['/projects/pct']
      if (!page) return
      return page.pages
        .map(url => this.$store.state.content[url])
        .filter(page => page)
        .filter(page => page.visible !== false)
        .sort((a, b) => (b.date.replace(/-/g, '') - a.date.replace(/-/g, '')))
    }
  }
}
</script>

<style scoped>

</style>