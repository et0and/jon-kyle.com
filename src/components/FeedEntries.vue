<template>
  <div class="container-feed">
    <div
      v-for="(entry, i) in visible"
      :key="entry.name"
    >
      <ContentEntry
        :entry="entry"
        :truncate="true"
      />
      <div class="instagram" v-if="isInstagramVisible && i === 0">
        <div class="heading">
          <a href="https://instagram.com/jondashkyle" target="_blank">@jondashkyle</a> on Instagram
        </div>
        <div class="gram" v-for="(gram, i) in instagram" :key="'insta-' + i">
          <a :href="'https://instagram.com/p/' + gram.shortcode" target="_blank"><img :src="gram.url"/></a>
        </div>
      </div>
    </div>
    <paginate
      v-model="page"
      v-if="count > 1"
      :page-count="count"
      :click-handler="onPaginationClick"
      :page-range="range"
      :prev-text="'← Present'"
      :next-text="'Past →'"
      :prev-link-class="'icon-button-arrow left'"
      :next-link-class="'icon-button-arrow right'"
      :container-class="'pagination a-hover'"
    />
  </div>
</template>

<script>
import Paginate from 'vuejs-paginate'
import ContentEntry from './ContentEntry'

export default {
  name: 'FeedEntries',
  components: { ContentEntry, Paginate },
  watch: {
    '$route.query.page': function (page) {
      this.page = parseInt(page) || 1
    },
  },
  props: {
    entries: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      page: parseInt(this.$route.query.page) || 1,
    }
  },
  computed: {
    range () {
      return this.$store.state.ui.range
    },
    count () {
      return Math.ceil(this.entries.length / this.range)
    },
    visible () {
      const page = this.page - 1
      return this.entries
        .slice((page * this.range), ((page * this.range) + this.range))
    },
    instagram () {
      return this.$store.state.instagram.slice(0, 6)
    },
    isInstagramVisible () {
      return false
      // return this.$route.path === '/' && this.page - 1 === 0
    }
  },
  methods: {
    onPaginationClick(page) {
      const newQuery = Object.assign({}, this.$route.query, { page })
      if (page === 1) delete newQuery.page
      this.$router.push({ path: this.$route.path, query: newQuery })
    }
  },
}
</script>

<style scoped>
.container-feed > div:not(:first-child) {
  margin-top: 5rem;
}

.pagination {
  display: flex;
  justify-content: center;
  list-style: none;
  margin-top: 4.5rem;
}

.pagination >>> li.disabled a {
  color: rgba(var(--fg), 0.25);
  pointer-events: none;
}

.pagination >>> li.active a {
  color: rgba(var(--fg), 0.25);
}

.pagination >>> a {
  display: block;
  padding: 0.5rem;
  outline: 0;
}

.instagram {
  display: grid;
  margin-top: 4rem;
  grid-gap: 1rem;
  grid-template-columns: repeat(6, 1fr);
  padding: 1rem;
}

.instagram .heading {
  grid-column: 1 / -1;
  text-align: center;
}

.instagram .gram {
  padding-bottom: 100%;
  position: relative;
  background: rgba(var(--fg), 0.2);
  width: 100%;
}

.instagram img {
  display: block;
  height: auto;
  width: 100%;
  position: absolute;
}

@media (max-width: 600px) {
  .instagram {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
