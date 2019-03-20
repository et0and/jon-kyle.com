<template>
  <div>
    <ContentEntry :entry="page" v-if="page" :key="page.name" />
    <div class="footer">
      <div v-if="next">
        Next<br>
        <router-link :to="next.url">{{next.dateFormatted}}</router-link>
      </div>
      <div v-if="prev">
        Previous<br>
        <router-link :to="prev.url">{{prev.dateFormatted}}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ContentEntry from '@/components/ContentEntry'
import FeedEntries from '@/components/FeedEntries'
import { mixin } from '../store'

export default {
  name: 'home',
  mixins: [mixin],
  components: {
    ContentEntry,
  },
  metaInfo() {
    return { title: this.title }
  },
  computed: {
    entries() {
      return this.$store.state.content['/entries']
    },
    prev() {
      if (!this.entries || !this.page) return
      const index = this.entries.pages.indexOf(this.page.url)
      return this.$store.state.content[this.entries.pages[index - 1]]
    },
    next() {
      if (!this.entries || !this.page) return
      const index = this.entries.pages.indexOf(this.page.url)
      return this.$store.state.content[this.entries.pages[index + 1]]
    },
    title() {
      if (!this.page) return
      const { dateFormatted, content } = this.page
      if (content && content.substring(0, 2) === '# ') {
        return content.substring(2, content.indexOf('\n'))
      }
      return dateFormatted
    },
  },
}
</script>

<style scoped>
.footer {
  display: flex;
  margin-top: 4rem;
}

.footer > div {
  flex: 1;
  text-align: center;
}
</style>
