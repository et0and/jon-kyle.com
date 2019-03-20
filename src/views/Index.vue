<template>
  <IndexEntries v-if="entries" />
  <LoadingIndicator v-else />
</template>

<script>
import LoadingIndicator from '@/components/LoadingIndicator'
import IndexEntries from '@/components/IndexEntries.vue'

export default {
  name: 'index',
  components: { IndexEntries, LoadingIndicator },
  computed: {
    entries() {
      const entries = this.$store.state.content['/entries']
      if (!entries) return
      return entries
    },
  },
}
</script>
