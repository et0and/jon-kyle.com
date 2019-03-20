<template>
  <div class="container-index">
    <ul>
      <li v-for="entry in entries">
        <router-link :to="entry.url" class="mono">
          <h2>{{entry.title}}</h2>
          {{entry.dateFormatted}}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'IndexEntries',
  computed: {
    entries() {
      const entries = this.$store.state.content['/entries']
      if (!entries) return []
      return entries.pages
        .map(key => this.$store.state.content[key])
        .sort((a, b) => (b.date.replace(/-/g, '') - a.date.replace(/-/g, '')))
    },
    months() {
      if (!this.entries.length) return []
      return this.entries
    },
  },
}
</script>

<style scoped>
.container-index > div:not(:first-child) {

}

ul {
  margin: 1rem;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  grid-gap: 1rem;
}
</style>
