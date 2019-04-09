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
    this.$store.dispatch('fetchPage', '/entries/2019-04-19-pct')
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
    }
  }
}
</script>

<style scoped>

</style>