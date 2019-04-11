<template>
  <WrapperStandard>
    <FeedEntries v-if="entries" :entries="entries" />
    <LoadingIndicator v-else />
  </WrapperStandard>
</template>

<script>
import WrapperStandard from '@/components/WrapperStandard'
import LoadingIndicator from '@/components/LoadingIndicator'
import FeedEntries from '@/components/FeedEntries'

export default {
  name: 'Home',
  components: { FeedEntries, LoadingIndicator, WrapperStandard },
  mounted () {
    this.$store.dispatch('fetchPage', '/entries')
  },
  computed: {
    entries() {
      const entries = this.$store.state.content['/entries']
      if (!entries) return
      return entries.pages
        .map(url => this.$store.state.content[url])
        .filter(page => page)
        .filter(page => page.visible !== false)
        .sort((a, b) => (b.date.replace(/-/g, '') - a.date.replace(/-/g, '')))
    },
  },
}
</script>
