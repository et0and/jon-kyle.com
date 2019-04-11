<template>
  <WrapperStandard>
    <IndexEntries v-if="entries" />
    <LoadingIndicator v-else />
  </WrapperStandard>
</template>

<script>
import WrapperStandard from '@/components/WrapperStandard'
import LoadingIndicator from '@/components/LoadingIndicator'
import IndexEntries from '@/components/IndexEntries.vue'

export default {
  name: 'index',
  components: { IndexEntries, LoadingIndicator, WrapperStandard },
  computed: {
    entries() {
      const entries = this.$store.state.content['/entries']
      if (!entries) return
      return entries
    },
  },
}
</script>
