<template>
  <div v-if="entries">
    <div class="empty" v-if="!entries.length">
      No results<br>
      Try again maybe?<br><br>
      🙃
    </div>
    <FeedEntries v-else :entries="entries" />
  </div>
  <LoadingIndicator v-else />
</template>

<script>
import LoadingIndicator from '@/components/LoadingIndicator'
import FeedEntries from '@/components/FeedEntries.vue'
import * as lib from '@/store/lib'

export default {
  name: 'Search',
  components: { FeedEntries, LoadingIndicator },
  watch: {
    '$route.query.query': function (query) {
      this.query = query
      if (!this.$store.state.search[this.query]) {
        this.$store.dispatch('fetchSearch', query)
      }
    },
  },
  data() {
    return {
      query: this.$route.query.query,
    }
  },
  mounted() {
    if (!this.$store.state.search[this.query]) {
      this.$store.dispatch('fetchSearch', this.query)
    }
  },
  computed: {
    entries() {
      const entries = this.$store.state.search[this.query]
      if (!entries) return false
      return entries
        .map(key => this.$store.state.content[key])
        .filter(page => page.visible !== false)
    },
  },
}
</script>

<style scoped>
.empty {
  padding: 1rem;
}
</style>
