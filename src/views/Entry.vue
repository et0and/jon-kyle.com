<template>
  <div>
    <ContentEntry :entry="page" v-if="page" :key="page.name" />
    <div class="footer">
      <div v-if="next">
        <router-link :to="next.url">
          <span>Newer</span><br>
          <div>{{next.dateFormatted}}</div>
          <div v-if="next.title">{{next.title}}</div>
         </router-link>
      </div>
      <div v-if="prev">
        <router-link :to="prev.url">
          <span>Older</span><br>
          <div>{{prev.dateFormatted}}</div>
          <div v-if="prev.title">{{prev.title}}</div>
         </router-link>
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

.footer a { text-decoration: none }
.footer a span { text-decoration: underline }
</style>
