<template>
  <div>
    <ContentEntry :entry="page" v-if="page" :key="page.name" />
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
</style>
