<template>
  <div class="container-index">
    <ul>
      <li v-for="entry in entries">
        <router-link :to="entry.url">
          <div class="mono">{{entry.date}}</div>
          <div class="summary"><div v-if="entry.title">{{entry.title}}</div><div class="excerpt">{{cleanup(entry.excerpt || entry.summary)}}</div></div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import removeMarkdown from 'remove-markdown'

export default {
  name: 'IndexEntries',
  computed: {
    entries() {
      const entries = this.$store.state.content['/entries']
      if (!entries) return []
      return entries.pages
        .map(key => this.$store.state.content[key])
        .filter(page => page)
        .sort((a, b) => (b.date.replace(/-/g, '') - a.date.replace(/-/g, '')))
    }
  },
  methods: {
    cleanup (value) {
      return removeMarkdown(value, {
        stripListLeaders: true,
        useImgAltText: false
      })
    }
  }
}
</script>

<style scoped>
.container-index > div:not(:first-child) {

}

ul {
  list-style: none;
  margin: 1rem;
  white-space: nowrap;
}

ul li:not(:first-child) {
  border-top: 1px solid currentColor;
}

ul li a {
  display: flex;
  grid-gap: 1rem;
  padding: 0.5rem 0;
  text-decoration: none;
}

.mono { margin-right: 1rem }

.summary {
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.excerpt {
  display: inline-block;
  color: rgba(var(--fg), 0.25);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.summary > div:nth-child(2) {
  margin-left: 1rem;
}
</style>
